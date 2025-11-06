import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { test as setup } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scheduleFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.json');
const backupFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.backup.json');

setup('데이터 백업', async () => {
  console.log('setup test database...');
  // 이전 백업 파일이 있으면 삭제 (이전 테스트 실행의 잔여물)
  // if (fs.existsSync(backupFilePath)) {
  //   fs.unlinkSync(backupFilePath);
  // }

  // // 원본 데이터 백업
  // const originalData = fs.readFileSync(scheduleFilePath, 'utf-8');
  // fs.writeFileSync(backupFilePath, originalData);
  // console.log('📦 원본 데이터 백업 완료 (setup project)');
});
