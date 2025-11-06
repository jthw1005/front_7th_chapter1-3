import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: '제목' }).click();
  await page.getByRole('textbox', { name: '제목' }).fill('aa');
  await page.getByRole('textbox', { name: '날짜' }).press('Shift+Tab');
  await page.getByRole('textbox', { name: '날짜' }).press('Tab');
  await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-01');
  await page.getByRole('textbox', { name: '시작 시간' }).click();
  await page.getByRole('textbox', { name: '시작 시간' }).press('Shift+Tab');
  await page.getByRole('textbox', { name: '시작 시간' }).press('Shift+Tab');
  await page.getByRole('textbox', { name: '시작 시간' }).press('Tab');
  await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
  await page.getByRole('textbox', { name: '시작 시간' }).press('Tab');
  await page.getByRole('textbox', { name: '종료 시간' }).click();
  await page.getByRole('textbox', { name: '종료 시간' }).press('Shift+Tab');
  await page.getByRole('textbox', { name: '종료 시간' }).press('Shift+Tab');
  await page.getByRole('textbox', { name: '종료 시간' }).press('Tab');
  await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
  await page.getByRole('checkbox', { name: '반복 일정' }).check();
  await page.getByText('매일').click();
  await page.getByRole('option', { name: 'weekly-option' }).click();
  await page.getByTestId('event-submit-button').click();
  await page.getByRole('button', { name: 'Edit event' }).first().click();
  await page.getByRole('button', { name: '아니오' }).click();
  await page.getByRole('textbox', { name: '제목' }).click();
  await page.getByRole('textbox', { name: '제목' }).fill('aabb');
  await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-02');
  await page.getByTestId('event-submit-button').click();
  await page.getByRole('button', { name: 'Edit event' }).first().click();
  await page.getByRole('button', { name: '예' }).click();
  await page
    .locator('div')
    .filter({ hasText: '반복 일정 수정해당 일정만 수정하시겠어요?취소아니오예' })
    .nth(1)
    .click();
  await page.getByRole('button', { name: 'Edit event' }).nth(1).click();
  await page.getByRole('button', { name: '예' }).click();
  await page.getByRole('textbox', { name: '제목' }).dblclick();
  await page.getByRole('textbox', { name: '제목' }).fill('ccdddd');
  await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-10');
  await page.getByTestId('event-submit-button').click();
  await page.getByRole('button', { name: 'Delete event' }).first().click();
  await page.getByRole('button', { name: 'Edit event' }).first().click();
  await page.getByRole('textbox', { name: '제목' }).dblclick();
  await page.getByRole('textbox', { name: '제목' }).fill('asdf');
  await page.getByTestId('event-submit-button').click();
  await page.getByRole('button', { name: 'Edit event' }).nth(1).click();
  await page.getByRole('button', { name: '예' }).click();
  await page.getByRole('textbox', { name: '제목' }).click();
  await page.getByRole('textbox', { name: '제목' }).dblclick();
  await page.getByRole('textbox', { name: '제목' }).fill('ccsdf');
  await page.getByTestId('event-submit-button').click();
  await page.getByRole('button', { name: 'Edit event' }).nth(2).click();
  await page
    .locator('div')
    .filter({ hasText: '반복 일정 수정해당 일정만 수정하시겠어요?취소아니오예' })
    .nth(1)
    .press('Escape');
  await page.getByRole('button', { name: 'Edit event' }).nth(2).click();
  await page.getByRole('button', { name: '아니오' }).click();
  await page.getByRole('textbox', { name: '제목' }).dblclick();
  await page.getByRole('textbox', { name: '제목' }).click();
  await page.getByRole('textbox', { name: '제목' }).fill('aabbcdc');
  await page.getByTestId('event-submit-button').click();
  await page.getByTestId('event-submit-button').click();
});
