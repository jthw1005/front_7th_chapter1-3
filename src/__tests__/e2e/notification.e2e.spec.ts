import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('테스트를 위한 데이터 시딩', async ({ page }) => {
  await page.getByRole('textbox', { name: '제목' }).fill('스터디 하기');
  await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-18');
  await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');
  await page.getByRole('textbox', { name: '종료 시간' }).fill('20:00');
  await page.getByTestId('event-submit-button').click();
  await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

  await page.waitForTimeout(1000);
});

test('알림이 울리는 경우', async ({ page }) => {
  await expect(page.getByText('스터디 하기').first()).toBeVisible();
  await expect(page.getByText('10분 후 스터디 하기 일정이 시작됩니다.')).not.toBeVisible();

  page.clock.setFixedTime(new Date('2025-11-18T17:50'));
  await expect(page.getByText('10분 후 스터디 하기 일정이 시작됩니다.')).toBeVisible();
});
