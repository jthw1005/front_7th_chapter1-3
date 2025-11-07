import type { Meta, StoryObj } from '@storybook/react-vite';

import CalendarCell from '../components/CalendarCell';
import { Event } from '../types';

const meta = {
  component: CalendarCell,
  title: 'CalendarCell',
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarCell>;

export default meta;
type Story = StoryObj<typeof meta>;

const event: Event = {
  id: '1',
  title: '기존 회의',
  date: '2025-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

export const Default: Story = {
  args: {
    dayIndex: 0,
    day: 15,
    holiday: '',
    filteredEvents: [],
    notifiedEvents: [],
    onClick: () => {},
    droppableId: '2025-11-15',
  },
};

export const ShortEventName: Story = {
  args: {
    dayIndex: 0,
    day: 15,
    holiday: '',
    filteredEvents: [{ ...event, title: '간단한 일정' }],
    notifiedEvents: [],
    onClick: () => {},
    droppableId: '2025-11-15',
  },
};

export const LongEventName: Story = {
  args: {
    dayIndex: 0,
    day: 15,
    holiday: '',
    filteredEvents: [{ ...event, title: '간단하지 않은 일정간단하지 않은 일정간단하지 않은 일정' }],
    notifiedEvents: [],
    onClick: () => {},
    droppableId: '2025-11-15',
  },
};

export const Holiday: Story = {
  args: {
    dayIndex: 0,
    day: 3,
    holiday: '개천절',
    filteredEvents: [
      {
        ...event,
        date: '2025-11-03',
      },
    ],
    notifiedEvents: [],
    onClick: () => {},
    droppableId: '2025-11-03',
  },
};
