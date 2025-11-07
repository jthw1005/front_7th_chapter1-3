import { test, expect } from '@playwright/test';

test.describe('검색 및 필터 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('테스트를 위한 데이터 시딩', async ({ page }) => {
    await page.getByRole('textbox', { name: '제목' }).fill('영화보기');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-04');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('20:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    await page.getByRole('textbox', { name: '제목' }).fill('뮤지컬보기');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-05');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('20:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    await page.getByRole('textbox', { name: '제목' }).fill('연극보기');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-06');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('20:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    await page.waitForTimeout(1000);
  });

  test('검색어가 비어있는 경우 모든 일정을 확인할 수 있다.', async ({ page }) => {
    await page.getByLabel('일정 검색').fill('');

    await expect(page.getByTestId('event-list')).toContainText('영화보기');
    await expect(page.getByTestId('event-list')).toContainText('뮤지컬보기');
    await expect(page.getByTestId('event-list')).toContainText('연극보기');
  });

  test('뮤지컬을 검색하면 뮤지컬 일정만 표시된다.', async ({ page }) => {
    await page.getByLabel('일정 검색').fill('뮤지컬');

    await expect(page.getByTestId('event-list')).toContainText('뮤지컬보기');
    await expect(page.getByTestId('event-list')).not.toContainText('영화보기');
    await expect(page.getByTestId('event-list')).not.toContainText('연극보기');
  });

  test('관련 없는 검색어를 입력하면 일정이 표시되지 않는다.', async ({ page }) => {
    await page.getByLabel('일정 검색').fill('애니메이션 보기');

    await expect(page.getByTestId('event-list')).not.toContainText('뮤지컬보기');
    await expect(page.getByTestId('event-list')).not.toContainText('영화보기');
    await expect(page.getByTestId('event-list')).not.toContainText('연극보기');
  });
});
