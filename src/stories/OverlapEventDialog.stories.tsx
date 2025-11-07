import type { Meta, StoryObj } from '@storybook/react-vite';

import OverlapEventDialog from '../components/OverlapEventDialog';
import { Event } from '../types';

const meta = {
  title: 'OverlapEventDialog',
  component: OverlapEventDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof OverlapEventDialog>;

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
];

export const Single: Story = {
  args: {
    open: true,
    onClose: () => {},
    overlappingEvents: [events[0]],
    onConfirm: () => {},
  },
};

export const Multiple: Story = {
  args: {
    open: true,
    onClose: () => {},
    overlappingEvents: [events[0], events[1]],
    onConfirm: () => {},
  },
};
