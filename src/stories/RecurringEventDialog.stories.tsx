import type { Meta, StoryObj } from '@storybook/react-vite';

import RecurringEventDialog from '../components/RecurringEventDialog';

const meta: Meta<typeof RecurringEventDialog> = {
  title: 'RecurringEventDialog',
  component: RecurringEventDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  args: {
    open: true,
    onClose: () => {},
    onConfirm: () => {},
    mode: 'edit',
  },
};

export const Delete: Story = {
  args: {
    open: true,
    onClose: () => {},
    onConfirm: () => {},
    mode: 'delete',
  },
};
