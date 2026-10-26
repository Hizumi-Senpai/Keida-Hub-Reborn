import { test as base, expect } from '@playwright/test';
import { AccountFixture } from './app.ts';

export const test = base.extend<{ account: AccountFixture }>({
  account: async ({}, use) => {
    const fixture = await AccountFixture.create();
    try { await use(fixture); }
    finally { await fixture.close(); }
  },
});
export { expect };
