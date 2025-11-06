import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scheduleFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.json');
const backupFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.backup.json');

async function globalSetup() {
  // 원본 데이터 백업
  const originalData = fs.readFileSync(scheduleFilePath, 'utf-8');
  fs.writeFileSync(backupFilePath, originalData);
  console.log('📦 원본 데이터 백업 완료 (global setup)');
}

export default globalSetup;
