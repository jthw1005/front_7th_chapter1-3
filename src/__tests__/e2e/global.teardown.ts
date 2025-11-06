import { test as teardown } from '@playwright/test';

teardown('delete database', async () => {
  console.log('reset test database...');
  // Delete the database
});
