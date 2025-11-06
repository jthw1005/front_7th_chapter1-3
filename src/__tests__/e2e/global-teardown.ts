import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scheduleFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.json');
const backupFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.backup.json');

async function globalTeardown() {
  // 백업 데이터로 복원
  if (fs.existsSync(backupFilePath)) {
    const backupData = fs.readFileSync(backupFilePath, 'utf-8');
    fs.writeFileSync(scheduleFilePath, backupData);
    fs.unlinkSync(backupFilePath); // 백업 파일 삭제
    console.log('♻️ 원본 데이터로 복원 완료 (global teardown)');
  }
}

export default globalTeardown;
