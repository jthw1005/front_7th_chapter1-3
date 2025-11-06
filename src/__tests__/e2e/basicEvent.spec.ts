import { test, expect } from '@playwright/test';

test('일정을 생성할 수 있다.', async ({ page }) => {
  await page.goto('http://localhost:5173/');
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

  await expect(page.getByTestId('event-list')).toContainText('시훈이 만나기');
});
