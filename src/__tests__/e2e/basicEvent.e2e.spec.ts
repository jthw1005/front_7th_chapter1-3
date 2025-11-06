import { test, expect } from '@playwright/test';

test.describe('기본 일정 관리 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('새로운 일정을 생성할 수 있다.', async ({ page }) => {
    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('영화보기');

    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-04');

    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');

    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).fill('20:00');

    await page.getByRole('textbox', { name: '설명' }).click();
    await page.getByRole('textbox', { name: '설명' }).fill('다크나이트');

    await page.getByRole('textbox', { name: '위치' }).click();
    await page.getByRole('textbox', { name: '위치' }).fill('여의도');

    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '개인-option' }).click();

    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '1시간 전' }).click();

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 추가되었습니다');

    await expect(page.getByTestId('event-list')).toContainText('영화보기');
  });

  test('기존 일정을 확인할 수 있다.', async ({ page }) => {
    await expect(page.getByTestId('event-list')).toContainText('영화보기');
  });

  test('기존 일정을 수정할 수 있다.', async ({ page }) => {
    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '영화보기' })
      .getByRole('button', { name: 'Edit event' })
      .first()
      .click();

    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('뮤지컬보기');

    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).fill('18:00');

    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).fill('21:00');

    await page.getByTestId('event-submit-button').click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 수정되었습니다');

    await expect(page.getByTestId('event-list')).toContainText('뮤지컬보기');
  });

  test('기존 일정을 삭제할 수 있다.', async ({ page }) => {
    await page
      .getByTestId('event-list')
      .locator('div')
      .filter({ hasText: '뮤지컬보기' })
      .getByRole('button', { name: 'Delete event' })
      .first()
      .click();

    await expect(page.getByRole('alert').last()).toContainText('일정이 삭제되었습니다');

    await expect(page.getByTestId('event-list')).not.toContainText('뮤지컬보기');
  });
});
