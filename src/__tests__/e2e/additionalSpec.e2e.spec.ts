import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe.serial('드래그 앤 드롭 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    fs.writeFileSync(
      `${__dirname}/../../__mocks__/response/e2e.json`,
      JSON.stringify({ events: [] })
    );
  });

  test('기본 일정을 드래그하여 다른 날짜로 이동할 수 있다.', async ({ page }) => {
    await page.getByRole('textbox', { name: '제목' }).fill('드래그 테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-01');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('14:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:00');
    await page.getByRole('textbox', { name: '설명' }).fill('드래그 테스트');
    await page.getByRole('textbox', { name: '위치' }).fill('회의실');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '업무-option' }).click();
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    const monthView = page.getByTestId('month-view');
    await expect(monthView).toContainText('드래그 테스트 일정');

    const eventToMove = monthView.getByText('드래그 테스트 일정');

    const targetCell = monthView
      .locator('td')
      .filter({ has: page.locator('text=5') })
      .first();

    await eventToMove.dragTo(targetCell);

    await page.waitForTimeout(500);
    const eventList = page.getByTestId('event-list');
    await expect(eventList).toContainText('드래그 테스트 일정');
    await expect(eventList).toContainText('2025-11-05');

    await expect(eventList).toContainText('14:00 - 15:00');
  });

  test('반복 일정을 드래그하여 다른 날짜에 드롭하면 이동 후 단일 일정으로 변환된다.', async ({
    page,
  }) => {
    await page.getByRole('textbox', { name: '제목' }).fill('반복 드래그 테스트');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-01');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByRole('textbox', { name: '설명' }).fill('반복 테스트');
    await page.getByRole('textbox', { name: '위치' }).fill('테스트 장소');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '개인-option' }).click();

    await page.getByRole('checkbox', { name: '반복 일정' }).check();
    await page.getByText('매일').click();
    await page.getByRole('option', { name: 'daily-option' }).click();
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-11-05');

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    const monthView = page.getByTestId('month-view');
    const repeatEvents = await monthView.getByText('반복 드래그 테스트').all();
    expect(repeatEvents.length).toBeGreaterThan(1);

    const firstRepeatEvent = repeatEvents[0];
    const targetCell = monthView
      .locator('td')
      .filter({ has: page.locator('text=10') })
      .first();

    await firstRepeatEvent.dragTo(targetCell);
    await page.waitForTimeout(500);

    const eventList = page.getByTestId('event-list');
    await expect(eventList).toContainText('반복 드래그 테스트');
    await expect(eventList).toContainText('2025-11-10');

    const movedEvent = eventList
      .locator('div')
      .filter({ hasText: '반복 드래그 테스트' })
      .filter({ hasText: '2025-11-10' })
      .first();

    await expect(movedEvent.locator('svg[data-testid="RepeatIcon"]')).not.toBeVisible();

    const remainingRepeatEvents = await eventList
      .locator('div')
      .filter({ hasText: '반복 드래그 테스트' })
      .filter({ has: page.locator('svg[data-testid="RepeatIcon"]') })
      .all();

    expect(remainingRepeatEvents.length).toBeGreaterThan(0);
  });

  test('드래그 앤 드롭으로 일정을 옮길 때, 일정 간 시간이 겹쳐도 이동시킨다.', async ({ page }) => {
    // 1. 월간 뷰에서 시간만 겹치고 날짜는 서로 다른 두 개의 일정 생성
    // 첫 번째 일정 (2025-11-01 09:00-10:00)
    await page.getByRole('textbox', { name: '제목' }).fill('일정 A');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-01');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '설명' }).fill('테스트 A');
    await page.getByRole('textbox', { name: '위치' }).fill('장소 A');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    // 두 번째 일정 (2025-11-03 09:30-10:30) - 시간이 겹치지만 날짜는 다름
    await page.getByRole('textbox', { name: '제목' }).fill('일정 B');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-03');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:30');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:30');
    await page.getByRole('textbox', { name: '설명' }).fill('테스트 B');
    await page.getByRole('textbox', { name: '위치' }).fill('장소 B');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    // 2. 일정 B를 2025-11-01로 드래그 앤 드롭 (일정 A와 시간이 겹침)
    const monthView = page.getByTestId('month-view');
    const eventB = monthView.locator('div').filter({ hasText: '일정 B' }).first();
    const targetCell = monthView
      .locator('td')
      .filter({ has: page.locator('text=1') })
      .first();

    await eventB.dragTo(targetCell);
    await page.waitForTimeout(500);

    // 3. 일정이 올바르게 이동되었는지 확인 (겹침 경고 없이 이동됨)
    const eventList = page.getByTestId('event-list');
    await expect(eventList).toContainText('일정 B');
    await expect(eventList).toContainText('2025-11-01');

    // 4. 두 일정 모두 2025-11-01에 존재하는지 확인
    const nov01Events = await eventList.locator('div').filter({ hasText: '2025-11-01' }).all();
    expect(nov01Events.length).toBeGreaterThanOrEqual(2);
  });

  test('날짜 칸을 클릭하면 일정 생성 폼에 있는 날짜 필드에 해당 날짜가 자동으로 입력된다.', async ({
    page,
  }) => {
    // 1. 캘린더에서 빈 셀 (2025-11-15) 클릭
    const monthView = page.getByTestId('month-view');
    const cell15 = monthView
      .locator('td')
      .filter({ has: page.locator('text=15') })
      .first();

    await cell15.click();

    // 2. 일정 추가 폼의 날짜 필드에 2025-11-15가 자동으로 입력되었는지 확인
    const dateInput = page.getByRole('textbox', { name: '날짜' });
    await expect(dateInput).toHaveValue('2025-11-15');

    // 3. 다른 빈 셀 (2025-11-20) 클릭
    const cell20 = monthView
      .locator('td')
      .filter({ has: page.locator('text=20') })
      .first();

    await cell20.click();

    // 4. 날짜 필드가 2025-11-20으로 업데이트되었는지 확인
    await expect(dateInput).toHaveValue('2025-11-20');

    // 5. 실제로 해당 날짜에 일정을 생성할 수 있는지 확인
    await page.getByRole('textbox', { name: '제목' }).fill('셀 클릭 테스트');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('13:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('14:00');
    await page.getByRole('textbox', { name: '설명' }).fill('클릭 테스트');
    await page.getByRole('textbox', { name: '위치' }).fill('테스트 장소');
    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    // 6. 2025-11-20에 일정이 생성되었는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList).toContainText('셀 클릭 테스트');
    await expect(eventList).toContainText('2025-11-20');
  });
});
