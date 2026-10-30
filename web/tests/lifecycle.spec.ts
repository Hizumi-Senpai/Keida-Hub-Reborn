import { createHash } from 'node:crypto';
import type { Page } from '@playwright/test';
import { test, expect } from '../fixture/test.ts';
import type { AccountFixture } from '../fixture/app.ts';

// A successful native claim/sign-in lands on Home. These lifecycle cases then
// deliberately open Account to exercise its independent recovery enhancement.
async function homeThenAccount(account: AccountFixture, page: Page): Promise<void> {
  process.stdout.write('BROWSER_STEP lifecycle await native Home landing\n');
  await page.waitForURL(`${account.origin}/workspace`);
  process.stdout.write('BROWSER_STEP lifecycle open fresh Account recovery document\n');
  await page.goto('/account');
}

async function owner(account: AccountFixture, page: Page): Promise<void> {
  await page.goto('/account/claim');
  await page.getByLabel('Setup secret', { exact: true }).fill(account.setupSecret);
  await page.getByLabel('Username', { exact: true }).fill(account.ownerName);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Create owner', exact: true }).click();
  await homeThenAccount(account, page);
  await page.bringToFront();
  await expect(page.locator('#account-private')).toBeVisible();
  expect(await page.locator('[data-account-name]').textContent() === account.ownerName, 'fresh session probe populates current owner').toBe(true);
}

async function empty(page: Page): Promise<void> {
  await expect(page.locator('#account-private')).toBeHidden();
  expect(await page.locator('[data-account-name]').textContent() === '', 'old private name cleared').toBe(true);
  expect(await page.locator('[data-account-role]').textContent() === '', 'old private role cleared').toBe(true);
}

test('cross-tab account switching rejects a held old-session response and requires fresh document', async ({ account }) => {
  const context = await account.context();
  let postCount = 0;
  context.on('request', (request) => { if (request.method() === 'POST') ++postCount; });
  const original = await context.newPage();
  await owner(account, original);
  const memberPassword = account.newPassword();
  const memberName = 'lifecycle_member';
  await account.createMember(original, memberName, memberPassword);
  const protocol = await context.newCDPSession(original);
  await protocol.send('Fetch.enable', { patterns: [{ urlPattern: '*/api/auth/session', requestStage: 'Response' }] });
  const paused = new Promise<{ requestId: string; responseStatusCode?: number }>((resolve) => {
    protocol.once('Fetch.requestPaused', (event) => resolve(event));
  });
  await original.evaluate(() => window.dispatchEvent(new Event('focus')));
  const held = await Promise.race([
    paused,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Actual session response did not reach the held-response seam')), 3_000)),
  ]);
  expect(held.responseStatusCode, 'held response was a real authorized browser request').toBe(200);
  // The response is paused by Chromium only after normal HTTPS validation and
  // an actual Rust session response. No fetch mock, cookie or private body is injected.
  const switched = await context.newPage();
  await switched.bringToFront();
  await switched.goto('/account/sign-in');
  await switched.getByLabel('Username', { exact: true }).fill(memberName);
  await switched.getByLabel('Password', { exact: true }).fill(memberPassword);
  await switched.getByRole('button', { name: 'Sign in', exact: true }).click();
  await homeThenAccount(account, switched);
  await expect(switched.locator('#account-private')).toBeVisible();
  expect(await switched.locator('[data-account-name]').textContent() === memberName, 'new document shows selected member').toBe(true);
  await empty(original);
  await protocol.send('Fetch.continueRequest', { requestId: held.requestId }).catch(() => undefined);
  await protocol.send('Fetch.disable');
  await original.bringToFront();
  await expect(original.locator('[data-account-status]')).toContainText(/changed|fresh|incompatible/i);
  await empty(original);
  // Even the fresh member probe cannot hydrate an old owner document because
  // its initial session guard belongs to the retired owner token.
  const postsBefore = postCount;
  const freshProbe = original.waitForResponse((response) => response.request().method() === 'GET'
    && new URL(response.url()).pathname === '/api/auth/session');
  await original.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  expect((await freshProbe).status()).toBe(200);
  await expect(original.locator('[data-account-status]')).toContainText(/changed|fresh|incompatible/i);
  await empty(original);
  expect(postCount, 'restoration never submits an operation').toBe(postsBefore);
  await original.goto('/account');
  await expect(original.locator('#account-private')).toBeVisible();
  expect(await original.locator('[data-account-name]').textContent() === memberName, 'deliberate fresh GET accepts current account').toBe(true);
  await protocol.detach();
});

test('visible account notices remote expiry with bounded probing and clears private content', async ({ account }) => {
  const page = await account.page();
  await owner(account, page);
  const token = await account.sessionValue(page.context());
  const verifier = createHash('sha256').update(token).digest();
  await account.sql('UPDATE sessions SET created_at = 0, expires_at = 1 WHERE verifier = $1', [verifier]);
  await expect(page.locator('#account-private')).toBeHidden({ timeout: 20_000 });
  await empty(page);
  await expect(page.locator('[data-account-status]')).toContainText(/ended|sign.in/i);
  const response = await page.goto('/account/sign-in');
  expect(response?.status()).toBe(200);
  expect(await page.getByLabel('Password', { exact: true }).inputValue() === '', 'expiry recovers a blank native sign-in form').toBe(true);
});

test('synthetic lifecycle and actual back-forward navigation preserve private identity and never replay POST', async ({ account }) => {
  const page = await account.page();
  await owner(account, page);
  const observed: string[] = [];
  page.on('request', (request) => { if (request.method() === 'POST') observed.push(new URL(request.url()).pathname); });
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  await empty(page);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect(page.locator('#account-private')).toBeVisible();
  expect(await page.locator('[data-account-name]').textContent() === account.ownerName, 'restored page displays only fresh authorized identity').toBe(true);
  expect(observed.length, 'lifecycle restoration never replays a POST').toBe(0);

  // Exercise real browser history as well as the explicit lifecycle seam above.
  // Both bfcache restoration and eviction followed by a new GET are valid, but
  // either account document must obtain a fresh authorized identity response.
  await page.goto('/account/sign-in');
  expect(await page.getByLabel('Password', { exact: true }).inputValue() === '', 'history destination has no retained password').toBe(true);
  const firstBackProbe = page.waitForResponse((response) => response.request().method() === 'GET'
    && new URL(response.url()).pathname === '/api/auth/session');
  await page.goBack();
  await page.waitForURL(`${account.origin}/account`);
  expect((await firstBackProbe).status(), 'real back navigation freshly authorizes identity').toBe(200);
  await expect(page.locator('#account-private')).toBeVisible();
  expect(await page.locator('[data-account-name]').textContent() === account.ownerName, 'back navigation displays only the freshly authorized owner').toBe(true);
  await page.goForward();
  await page.waitForURL(`${account.origin}/account/sign-in`);
  expect(await page.getByLabel('Password', { exact: true }).inputValue() === '', 'forward navigation retains no password').toBe(true);
  expect(observed.length, 'actual back and forward never replay credentials or POST').toBe(0);

  const secondBackProbe = page.waitForResponse((response) => response.request().method() === 'GET'
    && new URL(response.url()).pathname === '/api/auth/session');
  await page.goBack();
  await page.waitForURL(`${account.origin}/account`);
  expect((await secondBackProbe).status()).toBe(200);
  await expect(page.locator('#account-private')).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.waitForURL(`${account.origin}/account/sign-in`);
  expect(observed.length, 'only the deliberate native sign-out creates an operation').toBe(1);
  expect(observed[0]).toBe('/account/sign-out');
  const postLogoutProbes: number[] = [];
  page.on('response', (response) => {
    if (response.request().method() === 'GET' && new URL(response.url()).pathname === '/api/auth/session') postLogoutProbes.push(response.status());
  });
  await page.goBack();
  if (new URL(page.url()).pathname === '/account') {
    await expect.poll(() => postLogoutProbes.includes(401), { timeout: 8_000 }).toBe(true);
    await empty(page);
    await expect(page.locator('[data-account-status]')).toContainText(/ended|sign.in/i);
  } else {
    // A fresh protected GET may redirect directly to a blank sign-in form.
    await page.waitForURL(`${account.origin}/account/sign-in`);
    expect(await page.getByLabel('Password', { exact: true }).inputValue() === '', 'post-logout history recovery has no retained password').toBe(true);
  }
  expect((await page.content()).includes(account.ownerName), 'history after sign out cannot redisplay the old identity').toBe(false);
  expect(observed.length, 'post-logout back navigation never repeats the sign-out POST').toBe(1);
});

test('optional probe network failure hides identity while native sign out remains usable', async ({ account }) => {
  const page = await account.page();
  // A browser network fault is isolated to the optional read enhancement.
  // Native form submissions still traverse actual HTTPS to the Rust authority.
  await page.route('**/api/auth/session', (route) => route.abort('failed'));
  await page.goto('/account/claim');
  await page.getByLabel('Setup secret', { exact: true }).fill(account.setupSecret);
  await page.getByLabel('Username', { exact: true }).fill(account.ownerName);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await page.getByRole('button', { name: 'Create owner', exact: true }).click();
  await homeThenAccount(account, page);
  await expect(page.locator('[data-account-status]')).toContainText(/could not|unavailable|retry/i);
  await empty(page);
  await expect(page.getByRole('button', { name: 'Sign out', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.waitForURL(`${account.origin}/account/sign-in`);
  expect((await page.context().cookies(account.origin)).some((cookie) => cookie.name === '__Host-keida-reborn-session'), 'native sign out expires cookie despite optional probe fault').toBe(false);
});
