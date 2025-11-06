import { Close } from '@mui/icons-material';
import { Alert, AlertTitle, IconButton, Stack } from '@mui/material';

const AlertsBox = ({
  open,
  notifications,
  handleClickIconButton,
}: {
  open: boolean;
  notifications: { id: string; message: string }[];
  handleClickIconButton: (index: number) => void;
}) => {
  if (!open) return null;

  return (
    <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
      {notifications.map((notification, index) => (
        <Alert
          key={index}
          severity="info"
          sx={{ width: 'auto' }}
          action={
            <IconButton size="small" onClick={() => handleClickIconButton(index)}>
              <Close />
            </IconButton>
          }
        >
          <AlertTitle>{notification.message}</AlertTitle>
        </Alert>
      ))}
    </Stack>
  );
};

export default AlertsBox;
