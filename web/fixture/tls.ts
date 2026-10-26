import { execFile } from 'node:child_process';
import { chmod, lstat, mkdir, mkdtemp, readFile } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import { isAbsolute, join } from 'node:path';
import type { Duplex } from 'node:stream';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]', '::1']);

/** Test transport only: this process never serves the production application. */
export interface TlsProxy {
  origin: string;
  browserHome: string;
  close(): Promise<void>;
}

async function tool(command: string, args: string[]): Promise<void> {
  try {
    await execute(command, args, {
      timeout: 20_000,
      maxBuffer: 64 * 1024,
      windowsHide: true,
    });
  } catch {
    // Tool error objects can contain command lines, paths and captured output.
    // Discard them; private fixture material must never reach a test reporter.
    throw new Error('Private TLS fixture setup failed');
  }
}

async function privateDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true, mode: 0o700 });
  await chmod(path, 0o700);
}

/**
 * Enrolls a newly generated CA only in the fixture's isolated Chromium HOME.
 * Browser callers must pass HOME=browserHome and XDG_DATA_HOME beneath it.
 * Chromium M146+ prefers .local/share/pki/nssdb; an existing legacy .pki/nssdb
 * takes precedence. Both private locations contain the same fixture CA.
 * No certificate-validation bypass or global trust-store mutation is used.
 */
export async function startTlsProxy(upstreamUrl: string, workDir: string): Promise<TlsProxy> {
  try {
    return await setupTlsProxy(upstreamUrl, workDir);
  } catch {
    // Filesystem errors also contain private fixture paths; do not retain them
    // as an Error cause that a browser-test reporter could serialize.
    throw new Error('Private TLS fixture setup failed');
  }
}

async function setupTlsProxy(upstreamUrl: string, workDir: string): Promise<TlsProxy> {
  const upstream = new URL(upstreamUrl);
  if (
    upstream.protocol !== 'http:' ||
    !LOOPBACK_HOSTS.has(upstream.hostname) ||
    upstream.username !== '' ||
    upstream.password !== '' ||
    upstream.pathname !== '/' ||
    upstream.search !== '' ||
    upstream.hash !== '' ||
    !isAbsolute(workDir)
  ) {
    throw new Error('Invalid private TLS fixture configuration');
  }
  const info = await lstat(workDir);
  if (
    !info.isDirectory() ||
    info.isSymbolicLink() ||
    (info.mode & 0o077) !== 0 ||
    (typeof process.getuid === 'function' && info.uid !== process.getuid())
  ) {
    throw new Error('TLS fixture directory must be privately owned');
  }
  const directory = await mkdtemp(join(workDir, 'tls-'));
  await chmod(directory, 0o700);
  const caKey = join(directory, 'ca.key');
  const caCertificate = join(directory, 'ca.crt');
  const serverKey = join(directory, 'server.key');
  const serverCertificate = join(directory, 'server.crt');
  const request = join(directory, 'server.csr');
  const browserHome = join(directory, 'browser-home');
  await privateDirectory(browserHome);

  await tool('openssl', [
    'req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-sha256', '-days', '1',
    '-subj', '/CN=Reborn private browser fixture CA',
    '-addext', 'basicConstraints=critical,CA:TRUE,pathlen:0',
    '-addext', 'keyUsage=critical,keyCertSign,cRLSign',
    '-addext', 'subjectKeyIdentifier=hash',
    '-keyout', caKey, '-out', caCertificate,
  ]);
  await tool('openssl', [
    'req', '-newkey', 'rsa:2048', '-nodes', '-sha256',
    '-subj', '/CN=localhost',
    '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1',
    '-addext', 'basicConstraints=critical,CA:FALSE',
    '-addext', 'keyUsage=critical,digitalSignature,keyEncipherment',
    '-addext', 'extendedKeyUsage=serverAuth',
    '-keyout', serverKey, '-out', request,
  ]);
  await tool('openssl', [
    'x509', '-req', '-in', request, '-CA', caCertificate, '-CAkey', caKey,
    '-CAcreateserial', '-sha256', '-days', '1', '-copy_extensions', 'copy',
    '-out', serverCertificate,
  ]);
  await Promise.all([caKey, caCertificate, serverKey, serverCertificate, request]
    .map((path) => chmod(path, 0o600)));
  await tool('openssl', ['verify', '-CAfile', caCertificate, '-purpose', 'sslserver', serverCertificate]);

  const certutil = process.env.REBORN_CERTUTIL ?? 'certutil';
  for (const relative of ['.pki/nssdb', '.local/share/pki/nssdb']) {
    const database = join(browserHome, relative);
    await privateDirectory(database);
    await tool(certutil, ['-N', '--empty-password', '-d', `sql:${database}`]);
    await tool(certutil, [
      '-A', '-d', `sql:${database}`, '-t', 'C,,',
      '-n', 'Reborn private browser fixture CA', '-i', caCertificate,
    ]);
  }

  const server = https.createServer({
    key: await readFile(serverKey),
    cert: await readFile(serverCertificate),
    minVersion: 'TLSv1.2',
    maxHeaderSize: 16 * 1024,
  }, (incoming, outgoing) => {
    if (!incoming.url?.startsWith('/') || incoming.url.startsWith('//')) {
      outgoing.writeHead(400, { 'cache-control': 'no-store' }).end();
      return;
    }
    // Preserve native browser Origin, Host and Cookie headers. In particular,
    // never manufacture auth headers, browser cookies or a trusted forwarded IP.
    const forward = http.request({
      hostname: upstream.hostname.replace(/^\[(.*)\]$/, '$1'),
      port: upstream.port || 80,
      method: incoming.method,
      path: incoming.url,
      headers: incoming.headers,
      agent: false,
    }, (response) => {
      // Node retains Set-Cookie as an array; writeHead preserves each cookie.
      outgoing.writeHead(response.statusCode ?? 502, response.headers);
      response.pipe(outgoing);
      response.on('error', () => outgoing.destroy());
    });
    const deadline = setTimeout(() => forward.destroy(), 10_000);
    forward.on('timeout', () => forward.destroy());
    forward.setTimeout(8_000);
    forward.on('error', () => {
      if (outgoing.destroyed) return;
      if (!outgoing.headersSent) {
        outgoing.writeHead(502, { 'cache-control': 'no-store' }).end();
      } else {
        outgoing.destroy();
      }
    });
    incoming.on('aborted', () => forward.destroy());
    incoming.on('error', () => {
      forward.destroy();
      outgoing.destroy();
    });
    outgoing.on('close', () => {
      clearTimeout(deadline);
      forward.destroy();
    });
    incoming.pipe(forward);
  });
  server.headersTimeout = 5_000;
  server.requestTimeout = 10_000;
  server.keepAliveTimeout = 1_000;
  server.maxConnections = 64;
  const sockets = new Set<Duplex>();
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });
  // Untrusted-client negative checks are expected; never log TLS payloads.
  server.on('tlsClientError', () => undefined);
  await new Promise<void>((resolve, reject) => {
    server.once('error', () => reject(new Error('Private HTTPS fixture failed to listen')));
    server.listen(0, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Private HTTPS fixture has no loopback address');
  }
  let closed = false;
  return {
    origin: `https://127.0.0.1:${address.port}`,
    browserHome,
    async close() {
      if (closed) return;
      closed = true;
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    },
  };
}
