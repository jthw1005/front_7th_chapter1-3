import type { Meta, StoryObj } from '@storybook/react-vite';

import EventView from '../components/EventView';
import { Event } from '../types';

const meta = {
  component: EventView,
  title: 'EventView',
  tags: ['autodocs'],
} satisfies Meta<typeof EventView>;

export default meta;
type Story = StoryObj<typeof meta>;

const event: Event = {
  id: '1',
  title: '기존 회의',
  date: '2025-11-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

export const MonthView: Story = {
  args: {
    currentDate: new Date('2025-11-15'),
    filteredEvents: [event],
    notifiedEvents: [],
    view: 'month',
    holidays: {},
    navigate: () => {},
    setView: () => {},
    onEventUpdate: () => {},
    onDateClick: () => {},
  },
};

export const WeekView: Story = {
  args: {
    currentDate: new Date('2025-11-15'),
    filteredEvents: [event],
    notifiedEvents: [],
    view: 'week',
    holidays: {},
    navigate: () => {},
    setView: () => {},
    onEventUpdate: () => {},
    onDateClick: () => {},
  },
};
