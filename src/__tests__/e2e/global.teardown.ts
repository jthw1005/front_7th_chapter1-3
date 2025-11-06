import fs from 'fs';

import { test as teardown } from '@playwright/test';

teardown('DB 초기화', async () => {
  console.log('🗑️ Reset Test Database...');

  fs.writeFileSync(`${__dirname}/../__mocks__/response/e2e.json`, JSON.stringify({ events: [] }));
});
