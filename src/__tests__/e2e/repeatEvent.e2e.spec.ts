import { test, expect } from '@playwright/test';

test.describe.serial('반복 일정 관리 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('반복 유형이 매일인 반복 일정을 생성할 수 있다', async ({ page }) => {
    await page.getByRole('textbox', { name: '제목' }).fill('아침 운동');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-01');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('07:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('08:00');

    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByText('매일').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-12-31');

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');
  });

  test('캘린더에서 반복 일정 아이콘이 붙은 일정을 확인할 수 있다', async ({ page }) => {
    const eventList = page.getByTestId('event-list');
    await expect(eventList).toContainText('아침 운동');

    const eventItems = await eventList.locator('div').filter({ hasText: '아침 운동' }).all();
    expect(eventItems.length).toBeGreaterThan(0);

    const firstEvent = eventItems[0];
    const repeatIcon = firstEvent.locator('svg[data-testid="RepeatIcon"]');
    await expect(repeatIcon).toBeVisible();
  });

  test('기존 반복 일정 중 하나의 일정만 수정할 수 있다', async ({ page }) => {
    await expect(page.getByTestId('event-list')).not.toContainText('저녁 운동');

    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '아침 운동' })
      .getByRole('button', { name: 'Edit event' })
      .first()
      .click();

    await expect(page.getByText('반복 일정 수정')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('해당 일정만 수정하시겠어요?')).toBeVisible();

    await page.getByRole('button', { name: '예' }).click();

    await page.getByRole('textbox', { name: '제목' }).fill('저녁 운동');

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByTestId('event-list')).toContainText('저녁 운동', {
      timeout: 10000,
    });

    const remainingEvents = await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '아침 운동' })
      .all();
    expect(remainingEvents.length).toBeGreaterThan(0);
  });

  test('기존 반복 일정 전체를 수정할 수 있다', async ({ page }) => {
    await expect(page.getByTestId('event-list')).not.toContainText('테니스');

    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '아침 운동' })
      .getByRole('button', { name: 'Edit event' })
      .first()
      .click();

    await expect(page.getByText('반복 일정 수정')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: '아니오' }).click();

    const titleInput = page.getByRole('textbox', { name: '제목' });
    await titleInput.fill('테니스');

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByTestId('event-list')).toContainText('테니스', {
      timeout: 10000,
    });

    await expect(page.getByTestId('event-list')).not.toContainText('아침 운동', {
      timeout: 10000,
    });
  });

  test('기존 반복 일정 중 하나의 일정을 삭제할 수 있다', async ({ page }) => {
    const initialEvents = await page.getByTestId('event-list').getByText('테니스').all();
    const initialCount = initialEvents.length;
    expect(initialCount).toBeGreaterThan(0);

    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '테니스' })
      .getByRole('button', { name: 'Delete event' })
      .first()
      .click();

    await expect(page.getByText('반복 일정 삭제')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('해당 일정만 삭제하시겠어요?')).toBeVisible();

    await page.getByRole('button', { name: '예' }).click();

    await expect(page.locator('[role="alert"]:has-text("일정이 삭제되었습니다")')).toBeVisible({
      timeout: 10000,
    });

    const remainingEvents = await page.getByTestId('event-list').getByText('테니스').all();
    expect(remainingEvents.length).toBe(initialCount - 1);
  });

  test('기존 반복 일정 전체를 삭제할 수 있다', async ({ page }) => {
    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '테니스' })
      .getByRole('button', { name: 'Delete event' })
      .first()
      .click();

    await expect(page.getByText('반복 일정 삭제')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: '아니오' }).click();

    await page.waitForTimeout(1000);
    await expect(page.locator('[role="alert"]:has-text("일정이 삭제되었습니다")')).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId('event-list')).not.toContainText('테니스', {
      timeout: 10000,
    });

    await expect(page.getByTestId('event-list')).toContainText('저녁 운동', {
      timeout: 10000,
    });
  });
});
