import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scheduleFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.json');
let originalData: string;

test.describe.serial('기본 일정 관리 E2E 테스트', () => {
  test.beforeAll(async () => {
    originalData = fs.readFileSync(scheduleFilePath, 'utf-8');
    console.log('📦 원본 데이터 백업 완료');
  });

  test.afterAll(async () => {
    fs.writeFileSync(scheduleFilePath, originalData);
    console.log('♻️ 원본 데이터로 복원 완료');
  });

  test('기존 일정을 확인할 수 있다.', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('alert').nth(0)).toContainText('일정 로딩 완료!');

    await expect(page.getByTestId('event-list')).toContainText('테니스 레슨');
  });

  test('새로운 일정을 생성할 수 있다.', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('alert').nth(0)).toContainText('일정 로딩 완료!');

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

    await expect(page.getByRole('alert').nth(0)).toContainText('일정이 추가되었습니다');

    await expect(page.getByTestId('event-list')).toContainText('시훈이 만나기');
  });
});
