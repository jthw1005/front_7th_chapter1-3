// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const scheduleFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.json');
// const backupFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.backup.json');

// test.afterAll(async () => {
//   if (fs.existsSync(backupFilePath)) {
//     const backupData = fs.readFileSync(backupFilePath, 'utf-8');
//     fs.writeFileSync(scheduleFilePath, backupData);
//     fs.unlinkSync(backupFilePath);
//   }
// });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('기본 일정 관리 E2E 테스트', () => {
  test('기존 일정을 확인할 수 있다.', async ({ page }) => {
    await expect(page.getByTestId('event-list')).toContainText('테니스 레슨');
  });

  test('새로운 일정을 생성할 수 있다.', async ({ page }) => {
    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('시훈이 만나기');

    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-02');

    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).fill('13:00');

    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).fill('14:00');

    await page.getByRole('textbox', { name: '설명' }).click();
    await page.getByRole('textbox', { name: '설명' }).fill('새로운 일정 생성 테스트');

    await page.getByRole('textbox', { name: '위치' }).click();
    await page.getByRole('textbox', { name: '위치' }).fill('미정');

    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '개인-option' }).click();

    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '1시간 전' }).click();

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    await expect(page.getByTestId('event-list')).toContainText('시훈이 만나기');
  });

  test('기존 일정을 수정할 수 있다.', async ({ page }) => {
    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '테니스 레슨' })
      .getByRole('button', { name: 'Edit event' })
      .first()
      .click();

    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('테니스 레슨 시간 변경');

    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');

    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).fill('21:00');

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 수정되었습니다');

    await expect(page.getByTestId('event-list')).toContainText('테니스 레슨 시간 변경');
  });

  test('기존 일정을 삭제할 수 있다.', async ({ page }) => {
    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '삭제될 이벤트' })
      .getByRole('button', { name: 'Delete event' })
      .first()
      .click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 삭제되었습니다');

    await expect(page.getByTestId('event-list')).not.toContainText('삭제될 이벤트');
  });
});
