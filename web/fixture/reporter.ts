import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

// Playwright failure call logs can include fill() values or cookie headers.
// Emit only fixed test titles and source locations; never error messages, DOM,
// request bodies, process output, attachments or captured screenshots/traces.
export default class PrivateReporter implements Reporter {
  private completed = 0;
  onTestEnd(test: TestCase, result: TestResult): void {
    ++this.completed;
    const status = result.status === 'passed' ? 'PASS' : 'FAIL';
    const file = test.location.file.split('/').at(-1) ?? 'browser-test';
    process.stdout.write(`${status} ${test.title} (${file}:${test.location.line})\n`);
    const locations = new Set(result.errors.flatMap((error) => error.stack?.match(/(?:account|lifecycle)\.spec\.ts:[0-9]+:[0-9]+/g) ?? []));
    for (const location of locations) process.stdout.write(`AT ${location}\n`);
  }
  onStdOut(chunk: string | Buffer): void {
    const safe = chunk.toString();
    if (/^BROWSER_EVIDENCE Chromium [0-9.]+ source [a-f0-9]{40}\n$/.test(safe) || /^BROWSER_A11Y [a-z0-9,-]+\n$/.test(safe)) process.stdout.write(safe);
  }
  onStdErr(): void { /* No raw worker/process output reaches the report. */ }
  onError(): void {
    process.stderr.write('Browser harness prerequisite or worker failed; secret-bearing diagnostics suppressed.\n');
  }
  onEnd(result: FullResult): void {
    if (this.completed === 0) process.stdout.write(`Browser inventory only; no workflows executed (${result.status})\n`);
    else process.stdout.write(`Browser acceptance: ${result.status}; ${this.completed} test outcomes\n`);
  }
}
