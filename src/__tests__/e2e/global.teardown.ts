// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

import { test as teardown } from '@playwright/test';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

teardown('DB 초기화', async () => {
  console.log('🗑️ Reset Test Database...');

  // fs.writeFileSync(
  //   `${__dirname}/../../__mocks__/response/e2e.json`,
  //   JSON.stringify({ events: [] })
  // );
});
