import type { Meta, StoryObj } from '@storybook/react-vite';

import EventCard from '../components/EventCard';
import { Event } from '../types';

const meta = {
  component: EventCard,
  title: 'EventCard',
  tags: ['autodocs'],
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const events: Event[] = [
  {
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
  },
  {
    id: '2',
    title: '기존 회의2',
    date: '2025-10-15',
    startTime: '11:00',
    endTime: '12:00',
    description: '기존 팀 미팅 2',
    location: '회의실 C',
    category: '업무',
    repeat: { type: 'weekly', interval: 1 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '기존 회의3',
    date: '2025-10-15',
    startTime: '13:00',
    endTime: '14:00',
    description: '기존 팀 미팅 3',
    location: '회의실 D',
    category: '개인',
    notificationTime: 30,
    repeat: {
      type: 'none',
      interval: 0,
    },
  },
];

export const Default: Story = {
  args: {
    event: events[0],
    notifiedEvents: [],
    handleClickEdit: () => {},
    handleClickDelete: () => {},
  },
};

export const RepeatingEvent: Story = {
  args: {
    event: events[1],
    notifiedEvents: [],
    handleClickEdit: () => {},
    handleClickDelete: () => {},
  },
};

export const NotifiedEvent: Story = {
  args: {
    event: events[2],
    notifiedEvents: [events[2].id],
    handleClickEdit: () => {},
    handleClickDelete: () => {},
  },
};
