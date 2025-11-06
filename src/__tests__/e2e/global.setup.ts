import fs from 'fs';

import { test as setup } from '@playwright/test';

setup('DB 설정', async () => {
  console.log('💾 Setup Test Database...');

  fs.writeFileSync(
    `${__dirname}/../__mocks__/response/e2e.json`,
    JSON.stringify({
      events: [
        {
          id: '7f94b3ca-818b-4327-b576-3d6c9f7c7dd0',
          title: '친구 만나기',
          date: '2025-11-02',
          startTime: '13:00',
          endTime: '14:00',
          description: '새로운 일정 생성 테스트',
          location: '미정',
          category: '개인',
          repeat: { type: 'none', interval: 1 },
          notificationTime: 60,
        },
      ],
    })
  );
});
