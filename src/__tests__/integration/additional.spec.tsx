import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  setupMockHandlerCreation,
  setupMockHandlerListCreation,
} from '../../__mocks__/handlersUtils';
import App from '../../App';
import { server } from '../../setupTests';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('검색과 뷰 전환 통합 테스트', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({
          events: [
            {
              id: '1',
              title: '팀 회의',
              date: '2025-10-02',
              startTime: '09:00',
              endTime: '10:00',
              description: '주간 팀 미팅',
              location: '회의실 A',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
            {
              id: '2',
              title: '개인 일정',
              date: '2025-10-03',
              startTime: '14:00',
              endTime: '15:00',
              description: '개인 약속',
              location: '카페',
              category: '개인',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
            {
              id: '3',
              title: '프로젝트 미팅',
              date: '2025-10-04',
              startTime: '10:00',
              endTime: '11:00',
              description: '프로젝트 진행 상황 논의',
              location: '회의실 B',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
            {
              id: '4',
              title: '팀 워크샵',
              date: '2025-10-10',
              startTime: '13:00',
              endTime: '17:00',
              description: '팀 빌딩 워크샵',
              location: '회의실 C',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
          ],
        });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('뷰 전환 후 검색어를 입력하면 해당 뷰의 일정 중에서만 필터링된다', async () => {
    vi.setSystemTime(new Date('2025-10-01'));
    const { user } = setup(<App />);

    await screen.findByText('일정 로딩 완료!');

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByText('팀 회의')).toBeInTheDocument();
    expect(weekView.getByText('개인 일정')).toBeInTheDocument();
    expect(weekView.getByText('프로젝트 미팅')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀');

    expect(weekView.getByText('팀 회의')).toBeInTheDocument();
    expect(weekView.queryByText('개인 일정')).not.toBeInTheDocument();
    expect(weekView.queryByText('프로젝트 미팅')).not.toBeInTheDocument();

    const nextButton = screen.getByLabelText('Next');
    await user.click(nextButton);

    expect(weekView.getByText('팀 워크샵')).toBeInTheDocument();
    expect(weekView.queryByText('팀 회의')).not.toBeInTheDocument();
  });

  it('검색어를 지운 후 뷰를 변경하면 모든 일정이 표시된다', async () => {
    vi.setSystemTime(new Date('2025-10-01'));
    const { user } = setup(<App />);

    await screen.findByText('일정 로딩 완료!');

    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    await user.type(searchInput, '팀');

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('팀 회의')).toBeInTheDocument();
    expect(eventList.queryByText('개인 일정')).not.toBeInTheDocument();

    await user.clear(searchInput);

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByText('팀 회의')).toBeInTheDocument();
    expect(weekView.getByText('개인 일정')).toBeInTheDocument();
    expect(weekView.getByText('프로젝트 미팅')).toBeInTheDocument();
  });
});

describe('캘린더 셀 클릭과 일정 생성 통합 테스트', () => {
  it('빈 셀을 클릭하여 날짜가 자동 입력된 후 일정을 생성할 수 있다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    const monthView = within(screen.getByTestId('month-view'));
    const cell15 = monthView.getAllByText('15')[0].closest('td')!;
    await user.click(cell15);

    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-15');

    await user.type(screen.getByLabelText('제목'), '셀 클릭 테스트 일정');
    await user.type(screen.getByLabelText('시작 시간'), '10:00');
    await user.type(screen.getByLabelText('종료 시간'), '11:00');
    await user.type(screen.getByLabelText('설명'), '셀 클릭 테스트');
    await user.type(screen.getByLabelText('위치'), '테스트 장소');

    await user.click(screen.getByTestId('event-submit-button'));

    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('셀 클릭 테스트 일정')).toBeInTheDocument();
    expect(eventList.getByText('2025-10-15')).toBeInTheDocument();
  });

  it('다른 날짜 셀을 클릭하면 날짜 필드가 업데이트된다', async () => {
    const { user } = setup(<App />);

    const monthView = within(screen.getByTestId('month-view'));
    const cell5 = monthView.getAllByText('5')[0].closest('td')!;
    await user.click(cell5);

    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    expect(dateInput.value).toBe('2025-10-05');

    const cell20 = monthView.getAllByText('20')[0].closest('td')!;
    await user.click(cell20);

    expect(dateInput.value).toBe('2025-10-20');
  });
});

describe('반복 일정과 알림 통합 테스트', () => {
  it('반복 일정 생성 시 각 인스턴스마다 알림이 올바르게 설정된다', async () => {
    setupMockHandlerListCreation();

    vi.setSystemTime(new Date('2025-10-15 08:49:59'));

    const { user } = setup(<App />);

    await user.type(screen.getByLabelText('제목'), '매일 스탠드업');
    await user.type(screen.getByLabelText('날짜'), '2025-10-15');
    await user.type(screen.getByLabelText('시작 시간'), '09:00');
    await user.type(screen.getByLabelText('종료 시간'), '09:30');
    await user.type(screen.getByLabelText('설명'), '매일 스탠드업 미팅');
    await user.type(screen.getByLabelText('위치'), '회의실');

    await user.click(screen.getByLabelText('반복 일정'));
    await user.click(within(screen.getByLabelText('반복 유형')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'daily-option' }));
    await user.clear(screen.getByLabelText('반복 간격'));
    await user.type(screen.getByLabelText('반복 간격'), '1');
    await user.type(screen.getByLabelText('반복 종료일'), '2025-10-17');

    await user.click(screen.getByTestId('event-submit-button'));

    expect(screen.queryByText('10분 후 매일 스탠드업 일정이 시작됩니다.')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('10분 후 매일 스탠드업 일정이 시작됩니다.')).toBeInTheDocument();

    vi.setSystemTime(new Date('2025-10-16 08:49:59'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const notifications = screen.getAllByText(
      new RegExp('10분 후 매일 스탠드업 일정이 시작됩니다.')
    );
    expect(notifications.length).toBeGreaterThan(0);
  });
});

describe('뷰 전환과 일정 표시 통합 테스트', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({
          events: [
            {
              id: '1',
              title: '이번 주 회의',
              date: '2025-10-02',
              startTime: '09:00',
              endTime: '10:00',
              description: '주간 미팅',
              location: '회의실',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
            {
              id: '2',
              title: '다음 주 회의',
              date: '2025-10-10',
              startTime: '14:00',
              endTime: '15:00',
              description: '다음 주 미팅',
              location: '회의실',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
            {
              id: '3',
              title: '다음 달 회의',
              date: '2025-11-05',
              startTime: '10:00',
              endTime: '11:00',
              description: '다음 달 미팅',
              location: '회의실',
              category: '업무',
              repeat: { type: 'none', interval: 0 },
              notificationTime: 10,
            },
          ],
        });
      })
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('주간 뷰와 월간 뷰 전환 시 일정이 올바르게 필터링된다', async () => {
    vi.setSystemTime(new Date('2025-10-01'));
    const { user } = setup(<App />);

    await screen.findByText('일정 로딩 완료!');

    const monthView = within(screen.getByTestId('month-view'));
    expect(monthView.getByText('이번 주 회의')).toBeInTheDocument();
    expect(monthView.getByText('다음 주 회의')).toBeInTheDocument();
    expect(monthView.queryByText('다음 달 회의')).not.toBeInTheDocument();

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    const weekView = within(screen.getByTestId('week-view'));
    expect(weekView.getByText('이번 주 회의')).toBeInTheDocument();
    expect(weekView.queryByText('다음 주 회의')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Next'));

    expect(weekView.getByText('다음 주 회의')).toBeInTheDocument();
    expect(weekView.queryByText('이번 주 회의')).not.toBeInTheDocument();

    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'month-option' }));

    const monthViewAgain = within(screen.getByTestId('month-view'));
    expect(monthViewAgain.getByText('이번 주 회의')).toBeInTheDocument();
    expect(monthViewAgain.getByText('다음 주 회의')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Next'));

    expect(monthViewAgain.getByText('다음 달 회의')).toBeInTheDocument();
    expect(monthViewAgain.queryByText('이번 주 회의')).not.toBeInTheDocument();
  });
});
