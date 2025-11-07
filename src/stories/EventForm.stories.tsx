import type { Meta, StoryObj } from '@storybook/react-vite';

import EventForm from '../components/EventForm';

const meta: Meta<typeof EventForm> = {
  component: EventForm,
  title: 'EventForm',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '업무',
    startTimeError: null,
    endTimeError: null,
    notificationTime: 10,
  },
};

export const Filled: Story = {
  args: {
    title: '새로운 일정',
    date: '2025-11-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '새로운 일정 설명',
    location: '일정에 대한 장소',
    category: '업무',
    startTimeError: null,
    endTimeError: null,
    notificationTime: 10,
  },
};

export const Repeated: Story = {
  args: {
    title: '새로운 일정',
    date: '2025-11-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '새로운 일정 설명',
    location: '일정에 대한 장소',
    category: '업무',
    isRepeating: true,
    repeatType: 'weekly',
    repeatInterval: 1,
    repeatEndDate: '2025-12-31',
    startTimeError: null,
    endTimeError: null,
    notificationTime: 10,
  },
};

export const Error: Story = {
  args: {
    title: '새로운 일정',
    date: '2025-11-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '새로운 일정 설명',
    location: '일정에 대한 장소',
    category: '업무',
    startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    endTimeError: null,
    notificationTime: 10,
  },
};
