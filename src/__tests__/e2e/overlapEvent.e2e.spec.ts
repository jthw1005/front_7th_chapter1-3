import { test, expect } from '@playwright/test';

test.describe.serial('일정 겹침 처리 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('일정이 겹치는 경우 겹침 모달이 표시되고 계속 진행을 누르면 겹치는 일정이 추가된다.', async ({
    page,
  }) => {
    const eventList = page.getByTestId('event-list');

    await page.getByLabel('제목').fill('일정 A');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('09:30');
    await page.getByLabel('종료 시간').fill('10:30');
    await page.getByTestId('event-submit-button').click();

    await page.waitForTimeout(1000);

    await page.getByLabel('제목').fill('일정 B');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('10:00');
    await page.getByLabel('종료 시간').fill('12:00');
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByText('일정 겹침')).toBeVisible();
    await expect(page.getByText('다음 일정과 겹칩니다')).toBeVisible();

    await page.getByRole('button', { name: '계속 진행' }).click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    await expect(eventList.getByText('일정 A')).toBeVisible();
    await expect(eventList.getByText('일정 B')).toBeVisible();
  });

  test('일정입력 후 겹치는 경우 겹침 모달이 표시되고 취소를 누르면 일정이 추가되지 않는다.', async ({
    page,
  }) => {
    const eventList = page.getByTestId('event-list');

    await page.getByLabel('제목').fill('일정 C');
    await page.getByLabel('날짜').fill('2025-11-07');
    await page.getByLabel('시작 시간').fill('11:00');
    await page.getByLabel('종료 시간').fill('13:00');
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByText('일정 겹침')).toBeVisible();
    await expect(page.getByText('다음 일정과 겹칩니다')).toBeVisible();

    await page.getByRole('button', { name: '취소' }).click();
    await expect(page.getByText('일정 겹침')).not.toBeVisible();

    await expect(eventList.getByText('일정 A')).toBeVisible();
    await expect(eventList.getByText('일정 B')).toBeVisible();
    await expect(eventList.getByText('일정 C')).not.toBeVisible();
  });
});
