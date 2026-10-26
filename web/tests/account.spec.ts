import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from '../fixture/test.ts';
import type { AccountFixture } from '../fixture/app.ts';

const SESSION = '__Host-keida-reborn-session';
const FORM = '__Host-keida-reborn-form';
const PRODUCT = 'keida-hub-reborn';
const CONTRACT = 'reborn-auth-v1';

async function nativeValidity(page: Page, kind: 'claim' | 'sign-in'): Promise<void> {
  const valid = await page.getByLabel('Password', { exact: true }).evaluate((input) => (input as HTMLInputElement).form?.checkValidity() ?? false);
  process.stdout.write(`BROWSER_VALID ${kind} ${valid}\n`);
  expect(valid, 'native credential form is valid before deliberate submit').toBe(true);
}

async function claim(account: AccountFixture, page: Page): Promise<void> {
  await page.goto('/account/claim');
  await page.getByLabel('Setup secret', { exact: true }).fill(account.setupSecret);
  await page.getByLabel('Username', { exact: true }).fill(account.ownerName);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await nativeValidity(page, 'claim');
  const posted = page.waitForRequest((request) => request.method() === 'POST' && new URL(request.url()).pathname === '/account/claim');
  await page.getByRole('button', { name: 'Create owner', exact: true }).click();
  expect((await posted).headers()['origin'] === account.origin, 'native browser sends the exact configured Origin').toBe(true);
  await page.waitForURL(`${account.origin}/account`);
  await expect(page.getByRole('heading', { name: 'Your account', exact: true })).toBeVisible();
}

async function signIn(account: AccountFixture, page: Page, username: string, password: string): Promise<void> {
  await page.goto('/account/sign-in');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await nativeValidity(page, 'sign-in');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
}

async function sessionIdentity(page: Page): Promise<{ status: number; username?: string; role?: string }> {
  return page.evaluate(async ({ product, contract }) => {
    const response = await fetch('/api/auth/session', { headers: { 'X-Reborn-Product': product, 'X-Reborn-Contract': contract } });
    if (response.status !== 200) return { status: response.status };
    const result = await response.json() as { account: { username: string; role: string } };
    return { status: response.status, username: result.account.username, role: result.account.role };
  }, { product: PRODUCT, contract: CONTRACT });
}

async function freshBlankPassword(page: Page): Promise<void> {
  expect(await page.getByLabel('Password', { exact: true }).inputValue() === '', 'recovery password remains blank').toBe(true);
  const setup = page.getByLabel('Setup secret', { exact: true });
  if (await setup.count()) expect(await setup.inputValue() === '', 'recovery setup secret remains blank').toBe(true);
}

async function assertAccessible(page: Page): Promise<void> {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  if (result.violations.length) process.stdout.write(`BROWSER_A11Y ${result.violations.map((violation) => violation.id).filter((id) => /^[a-z0-9-]+$/.test(id)).join(',')}\n`);
  // Detailed nodes/HTML are intentionally not attached: they may contain private
  // display content. A failure reports only the fixed test title/source location.
  expect(result.violations.length, 'automated accessibility rules').toBe(0);
}

async function assertReflow(page: Page): Promise<void> {
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits, 'mobile document has no horizontal overflow').toBe(true);
}

test('native HTTPS owner claim, cookies, refresh and sign out work without JavaScript', async ({ account }) => {
  expect(await account.untrustedCertificateRejected(), 'fresh untrusted browser rejects fixture CA').toBe(true);
  const page = await account.page({ javaScriptEnabled: false });
  const response = await page.goto('/account/claim');
  expect(response?.status()).toBe(200);
  expect(await page.locator('meta[name="reborn-product"]').getAttribute('content') === PRODUCT, 'HTML product identity').toBe(true);
  expect(await page.locator('meta[name="reborn-commit"]').getAttribute('content') === process.env.REBORN_BROWSER_EXPECT_COMMIT, 'loaded HTML matches actual compiled source').toBe(true);
  const transport = await response?.securityDetails();
  expect(Boolean(transport && /^TLS 1\.[23]$/.test(transport.protocol ?? '')), 'real HTTPS transport').toBe(true);
  await freshBlankPassword(page);
  expect(await page.getByLabel('Username', { exact: true }).inputValue() === '', 'safe screenshot username blank').toBe(true);
  await page.screenshot({ path: test.info().outputPath('blank-claim-desktop.png'), fullPage: true });
  await page.getByLabel('Setup secret', { exact: true }).fill(account.setupSecret);
  await page.getByLabel('Username', { exact: true }).fill(account.ownerName);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  await nativeValidity(page, 'claim');
  const posted = page.waitForRequest((request) => request.method() === 'POST' && new URL(request.url()).pathname === '/account/claim');
  await page.getByRole('button', { name: 'Create owner', exact: true }).click();
  expect((await posted).headers()['origin'] === account.origin, 'native browser sends the exact configured Origin').toBe(true);
  await page.waitForURL(`${account.origin}/account`);
  await expect(page.getByRole('heading', { name: 'Your account', exact: true })).toBeVisible();
  const cookies = await page.context().cookies(account.origin);
  const session = cookies.find((cookie) => cookie.name === SESSION);
  expect(Boolean(session), 'native successful claim sets authenticated cookie').toBe(true);
  if (!session) throw new Error('Native authenticated cookie absent');
  account.secret(session.value);
  expect(/^[a-f0-9]{64}$/.test(session.value), 'opaque canonical session token').toBe(true);
  expect(session.secure && session.httpOnly && session.sameSite === 'Strict' && session.path === '/', 'cookie security attributes').toBe(true);
  expect(session.domain === '127.0.0.1', 'host-only cookie domain').toBe(true);
  expect(cookies.every((cookie) => cookie.name !== FORM), 'anonymous form cookie retired').toBe(true);
  expect((await page.content()).includes(account.ownerName), 'native HTML contains no account identity').toBe(false);
  expect(await page.locator('[data-account-name]').textContent() === '', 'private name starts empty without JavaScript').toBe(true);
  expect(await page.locator('[data-account-role]').textContent() === '', 'private role starts empty without JavaScript').toBe(true);
  await expect(page.locator('#account-private')).toBeHidden();
  const refreshed = await page.reload();
  expect(refreshed?.request().method(), 'refresh after native redirect is GET').toBe('GET');
  const owners = await account.sql<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');
  expect(owners[0].count, 'refresh never repeats owner creation').toBe('1');
  await expect(page.getByRole('heading', { name: 'Your account', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.waitForURL(`${account.origin}/account/sign-in`);
  await freshBlankPassword(page);
  expect((await page.context().cookies(account.origin)).some((cookie) => cookie.name === SESSION), 'native sign out expires session cookie').toBe(false);
  await signIn(account, page, account.ownerName, account.password);
  await page.waitForURL(`${account.origin}/account`);
  await page.getByRole('button', { name: 'Sign out everywhere', exact: true }).click();
  await page.waitForURL(`${account.origin}/account/sign-in`);
});

test('incorrect native password preserves the current session and clears submitted secrets', async ({ account }) => {
  const page = await account.page();
  await claim(account, page);
  const old = await account.sessionValue(page.context());
  await signIn(account, page, account.ownerName, account.newPassword());
  await expect(page.locator('#form-error')).toBeVisible();
  await freshBlankPassword(page);
  expect(await account.sessionValue(page.context()) === old, 'failed login preserves current bearer').toBe(true);
  const who = await sessionIdentity(page);
  expect(who.status).toBe(200);
  expect(who.username === account.ownerName, 'failed account switch preserves owner').toBe(true);
});

test('native account switch retires only the presented bearer and preserves another device', async ({ account }) => {
  const first = await account.page();
  await claim(account, first);
  const original = await account.sessionValue(first.context());
  const memberName = 'browser_member';
  const memberPassword = account.newPassword();
  await account.createMember(first, memberName, memberPassword);
  const secondDevice = await account.page();
  await signIn(account, secondDevice, account.ownerName, account.password);
  await secondDevice.waitForURL(`${account.origin}/account`);
  const otherDevice = await account.sessionValue(secondDevice.context());
  expect(otherDevice !== original, 'devices receive independent tokens').toBe(true);
  await signIn(account, first, memberName, memberPassword);
  await first.waitForURL(`${account.origin}/account`);
  const switched = await sessionIdentity(first);
  expect(switched.status).toBe(200);
  expect(switched.username === memberName && switched.role === 'member', 'fresh browser session belongs to selected member').toBe(true);
  expect(await account.verifierRetired(original), 'presented old bearer retired atomically').toBe(true);
  expect(await account.verifierRetired(otherDevice), 'other device bearer remains active').toBe(false);
  const preserved = await sessionIdentity(secondDevice);
  expect(preserved.status).toBe(200);
  expect(preserved.username === account.ownerName, 'other device owner authority retained').toBe(true);
});

test('stale native form guards reject effects and recover with blank controls', async ({ account }) => {
  const context = await account.context({ javaScriptEnabled: false });
  const stale = await context.newPage();
  await stale.goto('/account/claim');
  const fresh = await context.newPage();
  await fresh.goto('/account/claim');
  await stale.bringToFront();
  await stale.getByLabel('Setup secret', { exact: true }).fill(account.setupSecret);
  await stale.getByLabel('Username', { exact: true }).fill(account.ownerName);
  await stale.getByLabel('Password', { exact: true }).fill(account.password);
  const rejected = stale.waitForResponse((response) => response.request().method() === 'POST' && new URL(response.url()).pathname === '/account/claim');
  await stale.getByRole('button', { name: 'Create owner', exact: true }).click();
  expect((await rejected).status()).toBe(403);
  await expect(stale.locator('#form-error')).toBeVisible();
  await freshBlankPassword(stale);
  const counts = await account.sql<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');
  expect(counts[0].count).toBe('0');
  // Recovery uses a deliberate fresh GET and normal input, never replayed POST.
  await claim(account, stale);
});

test('actual ten-minute browser form expiry rejects the old form and recovers normally', async ({ account }) => {
  test.setTimeout(660_000);
  const page = await account.page({ javaScriptEnabled: false });
  await page.goto('/account/claim');
  const initial = (await page.context().cookies(account.origin)).find((cookie) => cookie.name === FORM);
  expect(Boolean(initial), 'native anonymous cookie exists before expiry').toBe(true);
  if (!initial) throw new Error('Native anonymous cookie absent');
  account.secret(initial.value);
  const deadline = performance.now() + 602_000;
  while (performance.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(30_000, deadline - performance.now())));
  }
  expect((await page.context().cookies(account.origin)).some((cookie) => cookie.name === FORM), 'real browser expires ten-minute cookie').toBe(false);
  await page.getByLabel('Setup secret', { exact: true }).fill(account.setupSecret);
  await page.getByLabel('Username', { exact: true }).fill(account.ownerName);
  await page.getByLabel('Password', { exact: true }).fill(account.password);
  const rejected = page.waitForResponse((response) => response.request().method() === 'POST' && new URL(response.url()).pathname === '/account/claim');
  await nativeValidity(page, 'claim');
  await page.getByRole('button', { name: 'Create owner', exact: true }).click();
  expect((await rejected).status()).toBe(403);
  await expect(page.locator('#form-error')).toBeVisible();
  await freshBlankPassword(page);
  const counts = await account.sql<{ count: string }>('SELECT COUNT(*)::text AS count FROM users');
  expect(counts[0].count).toBe('0');
  await claim(account, page);
});

test('schema drift and key mismatch fail closed without losing current account data', async ({ account }) => {
  const page = await account.page();
  await claim(account, page);
  await account.sql("INSERT INTO _sqlx_migrations(version,description,success,checksum,execution_time) VALUES(999,'owned-browser-future',TRUE,decode('00','hex'),0)");
  const response = await page.goto('/account');
  expect(response?.status()).toBe(503);
  await expect(page.getByRole('heading', { name: 'Account unavailable', exact: true })).toBeVisible();
  expect((await page.content()).includes(account.ownerName), 'unavailable document contains no private account snapshot').toBe(false);
  await account.sql('DELETE FROM _sqlx_migrations WHERE version = 999');
  await page.goto('/account');
  expect((await sessionIdentity(page)).status).toBe(200);
  await account.restart('wrong');
  const wrong = await page.goto('/account');
  expect(wrong?.status()).toBe(503);
  await expect(page.getByRole('heading', { name: 'Account unavailable', exact: true })).toBeVisible();
  await account.restart('matched');
  await page.goto('/account');
  const restored = await sessionIdentity(page);
  expect(restored.status).toBe(200);
  expect(restored.username === account.ownerName, 'matched key restoration retains original owner').toBe(true);
});

test('mobile native forms support labeled keyboard navigation and accessible reflow', async ({ account }) => {
  const page = await account.page({ mobile: true });
  await page.goto('/account/sign-in');
  await freshBlankPassword(page);
  await assertAccessible(page);
  await assertReflow(page);
  expect(await page.getByLabel('Username', { exact: true }).inputValue() === '', 'safe screenshot username blank').toBe(true);
  await page.screenshot({ path: test.info().outputPath('blank-sign-in-mobile.png'), fullPage: true });
  await page.getByLabel('Username', { exact: true }).focus();
  await expect(page.getByLabel('Username', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Password', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeFocused();
  const focus = await page.getByRole('button', { name: 'Sign in', exact: true }).evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== 'none' && style.outlineWidth !== '0px';
  });
  expect(focus, 'keyboard focus remains visible').toBe(true);
  await page.goto('/account/claim');
  await assertAccessible(page);
  await claim(account, page);
  await assertReflow(page);
  await assertAccessible(page);
  await expect(page.getByRole('button', { name: 'Sign out', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Sign out', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(`${account.origin}/account/sign-in`);
});
