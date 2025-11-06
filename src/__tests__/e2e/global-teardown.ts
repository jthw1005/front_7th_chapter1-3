import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupFilePath = path.join(__dirname, '../../__mocks__/response/realEvents.backup.json');

async function globalTeardown() {
  // 백업 파일 삭제
  if (fs.existsSync(backupFilePath)) {
    fs.unlinkSync(backupFilePath);
    console.log('🗑️ 백업 파일 삭제 완료 (global teardown)');
  }
}

export default globalTeardown;
