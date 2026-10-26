import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { Client } from 'pg';
import { randomBytes, createHash } from 'node:crypto';
import { spawn, execFile, type ChildProcess } from 'node:child_process';
import { mkdtemp, chmod, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join } from 'node:path';
import { createRequire } from 'node:module';
import http from 'node:http';
import net from 'node:net';
import { promisify } from 'node:util';
import { startTlsProxy, type TlsProxy } from './tls.ts';

const execute = promisify(execFile);
const PRODUCT = 'keida-hub-reborn';
const CONTRACT = 'reborn-auth-v1';
const SESSION_COOKIE = '__Host-keida-reborn-session';
let emittedEvidence = false;

function requireFixture(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error('Required browser fixture prerequisite is absent');
  return value;
}

async function unusedPort(): Promise<number> {
  const server = net.createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', () => reject(new Error('Fixture port allocation failed')));
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Fixture port allocation failed');
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return address.port;
}

async function liveness(port: number): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const request = http.get({ hostname: '127.0.0.1', port, path: '/api/health', timeout: 2_000 }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk: string) => { body += chunk; if (body.length > 8192) request.destroy(); });
      response.on('end', () => {
        try { if (response.statusCode !== 200) throw new Error(); resolve(JSON.parse(body)); }
        catch { reject(new Error('Fixture liveness failed')); }
      });
    });
    request.on('timeout', () => request.destroy());
    request.on('error', () => reject(new Error('Fixture liveness unavailable')));
  });
}

export class AccountFixture {
  private constructor(
    private readonly binary: string,
    private readonly expectedCommit: string,
    private readonly adminUrl: string,
    private readonly databaseName: string,
    private readonly databaseUrl: string,
    readonly workDir: string,
    readonly port: number,
    readonly tls: TlsProxy,
    readonly browser: Browser,
    readonly setupSecret: string,
    readonly password: string,
    readonly ownerName: string,
    private readonly keyFile: string,
    private readonly sensitive: Set<string>,
    private readonly contexts: BrowserContext[],
    private readonly outputs: string[],
    private child: ChildProcess | undefined,
  ) {}

  get origin(): string { return this.tls.origin; }
  private violation = false;

  static async create(): Promise<AccountFixture> {
    let admin: Client | undefined;
    let fixture: AccountFixture | undefined;
    let browser: Browser | undefined;
    let tls: TlsProxy | undefined;
    let directory: string | undefined;
    let name: string | undefined;
    let adminUrl: string | undefined;
    try {
      const binary = requireFixture('REBORN_BROWSER_BINARY');
      const expectedCommit = requireFixture('REBORN_BROWSER_EXPECT_COMMIT');
      if (!isAbsolute(binary) || !(await stat(binary)).isFile() || !/^[a-f0-9]{40}$/.test(expectedCommit)) {
        throw new Error();
      }
      adminUrl = requireFixture('REBORN_TEST_DATABASE_URL');
      const parsed = new URL(adminUrl);
      if (!['postgres:', 'postgresql:'].includes(parsed.protocol)
          || !['127.0.0.1', 'localhost', '[::1]'].includes(parsed.hostname)) throw new Error();
      name = `keida_reborn_browser_${process.pid}_${randomBytes(10).toString('hex')}`;
      if (!/^keida_reborn_browser_[0-9]+_[a-f0-9]{20}$/.test(name) || name.length > 63) throw new Error();
      admin = new Client({ connectionString: adminUrl, connectionTimeoutMillis: 2_000, query_timeout: 4_000 });
      await admin.connect();
      // Only a generated, ASCII-allowlisted owned name enters this identifier.
      await admin.query(`CREATE DATABASE "${name}"`);
      await admin.end(); admin = undefined;
      parsed.pathname = `/${name}`;
      const databaseUrl = parsed.toString();
      directory = await mkdtemp(join(tmpdir(), 'keida-reborn-browser-'));
      await chmod(directory, 0o700);
      const port = await unusedPort();
      tls = await startTlsProxy(`http://127.0.0.1:${port}`, directory);
      const browserEnvironment = {
        ...process.env,
        HOME: tls.browserHome,
        XDG_DATA_HOME: join(tls.browserHome, '.local/share'),
        XDG_CONFIG_HOME: join(tls.browserHome, '.config'),
      };
      const executable = process.env.REBORN_BROWSER_EXECUTABLE;
      if (executable && !isAbsolute(executable)) throw new Error();
      browser = await chromium.launch({ headless: true, env: browserEnvironment, executablePath: executable, timeout: 30_000 });
      const require = createRequire(import.meta.url);
      const bundled = JSON.parse(await readFile(join(dirname(require.resolve('playwright-core/package.json')), 'browsers.json'), 'utf8')) as { browsers: { name: string; browserVersion?: string }[] };
      const pinnedVersion = bundled.browsers.find((entry) => entry.name === 'chromium')?.browserVersion;
      if (!pinnedVersion || browser.version() !== pinnedVersion) throw new Error('Browser does not match the pinned Playwright version');
      const keyFile = join(directory, 'instance.key');
      const setupFile = join(directory, 'setup.token');
      const environment = {
        ...process.env,
        DATABASE_URL: databaseUrl,
        REBORN_BIND: `127.0.0.1:${port}`,
        REBORN_PUBLIC_ORIGIN: tls.origin,
        REBORN_DB_MAX_CONNECTIONS: '5',
        REBORN_INSTANCE_KEY_FILE: keyFile,
      };
      const outputs: string[] = [];
      for (const args of [['migrate'], ['init-key', keyFile], ['prepare-owner', setupFile]]) {
        const result = await execute(binary, args, { env: environment, timeout: 35_000, maxBuffer: 32 * 1024 });
        outputs.push(result.stdout, result.stderr);
      }
      const setupSecret = await readFile(setupFile, 'utf8');
      if (!/^[a-f0-9]{64}$/.test(setupSecret)) throw new Error();
      const password = randomBytes(24).toString('base64url');
      const ownerName = `owner_${randomBytes(7).toString('hex')}`;
      const sensitive = new Set([setupSecret, password, adminUrl, databaseUrl, keyFile, setupFile]);
      fixture = new AccountFixture(binary, expectedCommit, adminUrl, name, databaseUrl, directory, port, tls, browser,
        setupSecret, password, ownerName, keyFile, sensitive, [], outputs, undefined);
      await fixture.restart('matched');
      if (!emittedEvidence) {
        process.stdout.write(`BROWSER_EVIDENCE Chromium ${browser.version()} source ${expectedCommit}\n`);
        emittedEvidence = true;
      }
      return fixture;
    } catch {
      if (fixture) await fixture.stop().catch(() => undefined);
      if (admin) await admin.end().catch(() => undefined);
      if (browser) await browser.close().catch(() => undefined);
      if (tls) await tls.close().catch(() => undefined);
      if (adminUrl && name) await dropDatabase(adminUrl, name).catch(() => undefined);
      if (directory) await rm(directory, { recursive: true, force: true });
      throw new Error('Account browser fixture setup failed; private diagnostics suppressed');
    }
  }

  private environment(keyFile: string | undefined): NodeJS.ProcessEnv {
    const environment: NodeJS.ProcessEnv = {
      ...process.env, DATABASE_URL: this.databaseUrl, REBORN_BIND: `127.0.0.1:${this.port}`,
      REBORN_PUBLIC_ORIGIN: this.origin, REBORN_DB_MAX_CONNECTIONS: '5',
    };
    delete environment.REBORN_INSTANCE_KEY_FILE;
    if (keyFile) environment.REBORN_INSTANCE_KEY_FILE = keyFile;
    return environment;
  }

  async restart(key: 'matched' | 'wrong' | 'absent'): Promise<void> {
    await this.stop();
    let keyFile: string | undefined = this.keyFile;
    if (key === 'wrong') {
      keyFile = join(this.workDir, `wrong-${randomBytes(6).toString('hex')}.key`);
      this.sensitive.add(keyFile);
      const result = await execute(this.binary, ['init-key', keyFile], { env: this.environment(undefined), timeout: 5_000, maxBuffer: 16 * 1024 });
      this.outputs.push(result.stdout, result.stderr);
    }
    if (key === 'absent') keyFile = undefined;
    const child = spawn(this.binary, ['serve'], { env: this.environment(keyFile), stdio: ['ignore', 'pipe', 'pipe'] });
    this.child = child;
    child.stdout?.on('data', (chunk: Buffer) => { this.captureOutput(chunk); });
    child.stderr?.on('data', (chunk: Buffer) => { this.captureOutput(chunk); });
    child.on('error', () => { this.violation = true; });
    const deadline = performance.now() + 10_000;
    while (performance.now() < deadline) {
      try {
        const health = await liveness(this.port);
        const identity = health.identity as Record<string, unknown>;
        if (identity.product !== PRODUCT || identity.commit !== this.expectedCommit) throw new Error('Compiled source identity differs');
        return;
      } catch { /* bounded startup inspection; no captured error text */ }
      if (child.exitCode !== null || child.signalCode !== null) break;
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    throw new Error('Rust browser fixture did not start with the expected identity');
  }

  private captureOutput(chunk: Buffer): void {
    const total = this.outputs.reduce((sum, value) => sum + value.length, 0);
    if (total + chunk.length > 128 * 1024) { this.violation = true; return; }
    this.outputs.push(chunk.toString('utf8'));
  }

  secret(value: string): string { this.sensitive.add(value); return value; }
  newPassword(): string { return this.secret(randomBytes(24).toString('base64url')); }

  async context(options: { javaScriptEnabled?: boolean; mobile?: boolean } = {}): Promise<BrowserContext> {
    const context = await this.browser.newContext({
      baseURL: this.origin,
      ignoreHTTPSErrors: false,
      javaScriptEnabled: options.javaScriptEnabled ?? true,
      viewport: options.mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
      isMobile: options.mobile ?? false,
      hasTouch: options.mobile ?? false,
      acceptDownloads: false,
    });
    this.contexts.push(context);
    context.on('request', (request) => {
      if ([...this.sensitive].some((secret) => secret.length > 12 && request.url().includes(secret))) this.violation = true;
    });
    context.on('response', (response) => {
      const contentType = response.headers()['content-type'] ?? '';
      if (contentType.includes('text/html') || contentType.includes('application/json')) {
        void response.text().then((body) => {
          if ([...this.sensitive].some((secret) => secret.length > 12 && body.includes(secret))) this.violation = true;
        }).catch(() => undefined);
      }
    });
    return context;
  }

  async page(options: { javaScriptEnabled?: boolean; mobile?: boolean } = {}): Promise<Page> {
    return (await this.context(options)).newPage();
  }

  async untrustedCertificateRejected(): Promise<boolean> {
    const browserHome = await mkdtemp(join(this.workDir, 'untrusted-browser-'));
    await chmod(browserHome, 0o700);
    let untrusted: Browser | undefined;
    try {
      untrusted = await chromium.launch({
        headless: true, executablePath: process.env.REBORN_BROWSER_EXECUTABLE,
        env: { ...process.env, HOME: browserHome, XDG_DATA_HOME: join(browserHome, '.local/share'), XDG_CONFIG_HOME: join(browserHome, '.config') },
        timeout: 30_000,
      });
      const context = await untrusted.newContext({ ignoreHTTPSErrors: false });
      const page = await context.newPage();
      try { await page.goto(`${this.origin}/api/health`, { timeout: 10_000 }); return false; }
      catch (error) { return error instanceof Error && error.message.includes('ERR_CERT_AUTHORITY_INVALID'); }
    } finally { if (untrusted) await untrusted.close(); }
  }

  async sessionValue(context: BrowserContext): Promise<string> {
    const cookie = (await context.cookies(this.origin)).find((cookie) => cookie.name === SESSION_COOKIE);
    if (!cookie) throw new Error('Expected native authenticated cookie was absent');
    return this.secret(cookie.value);
  }

  async sql<T extends Record<string, unknown> = Record<string, unknown>>(query: string, values: unknown[] = []): Promise<T[]> {
    const connection = new Client({ connectionString: this.databaseUrl, connectionTimeoutMillis: 2_000, query_timeout: 4_000 });
    try { await connection.connect(); return (await connection.query<T>(query, values)).rows; }
    catch { throw new Error('Owned browser database fault seam failed'); }
    finally { await connection.end().catch(() => undefined); }
  }

  async createMember(page: Page, username: string, password: string): Promise<void> {
    const result = await page.evaluate(async ({ username, password, product, contract }) => {
      const session = await fetch('/api/auth/session', { headers: { 'X-Reborn-Product': product, 'X-Reborn-Contract': contract } });
      if (session.status !== 200) return 0;
      const state = await session.json() as { csrf_token: string };
      const response = await fetch('/api/owner/members', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Reborn-Product': product,
          'X-Reborn-Contract': contract, 'X-CSRF-Token': state.csrf_token },
        body: JSON.stringify({ username, password }),
      });
      return response.status;
    }, { username, password: this.secret(password), product: PRODUCT, contract: CONTRACT });
    if (result !== 201) throw new Error('Authorized browser fixture member enrollment failed');
  }

  async verifierRetired(value: string): Promise<boolean> {
    const verifier = createHash('sha256').update(value).digest();
    const rows = await this.sql<{ revoked: boolean }>('SELECT revoked FROM sessions WHERE verifier = $1', [verifier]);
    return rows.length === 0 || rows[0].revoked;
  }

  async stop(): Promise<void> {
    const child = this.child;
    this.child = undefined;
    if (!child || child.exitCode !== null || child.signalCode !== null) return;
    child.kill('SIGTERM');
    const deadline = performance.now() + 7_000;
    while (child.exitCode === null && child.signalCode === null && performance.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
      throw new Error('Owned Rust fixture exceeded its shutdown deadline');
    }
  }

  async close(): Promise<void> {
    let cleanupFailed = false;
    for (const context of this.contexts) await context.close().catch(() => { cleanupFailed = true; });
    for (const operation of [() => this.stop(), () => this.browser.close(), () => this.tls.close(),
      () => dropDatabase(this.adminUrl, this.databaseName), () => rm(this.workDir, { recursive: true, force: true })]) {
      await operation().catch(() => { cleanupFailed = true; });
    }
    const output = this.outputs.join('');
    if (this.violation || [...this.sensitive].some((secret) => secret.length > 12 && output.includes(secret))) {
      throw new Error('Private browser fixture content leaked into a forbidden output');
    }
    if (cleanupFailed) throw new Error('Owned browser fixture cleanup did not finish');
  }

}

async function dropDatabase(adminUrl: string, name: string): Promise<void> {
  if (!/^keida_reborn_browser_[0-9]+_[a-f0-9]{20}$/.test(name) || name.length > 63) throw new Error('Database cleanup ownership mismatch');
  const admin = new Client({ connectionString: adminUrl, connectionTimeoutMillis: 2_000, query_timeout: 4_000 });
  try {
    await admin.connect();
    await admin.query(`DROP DATABASE "${name}" WITH (FORCE)`);
  } finally { await admin.end(); }
}
