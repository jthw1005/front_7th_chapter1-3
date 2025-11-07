import { Notifications, Repeat } from '@mui/icons-material';
import { Box, Stack, TableCell, Tooltip, Typography } from '@mui/material';

import Draggable from './Draggable.tsx';
import Droppable from './Droppable.tsx';
import { Event } from '../types.ts';
import { getEventsForDay } from '../utils/dateUtils.ts';
import { getRepeatTypeLabel } from '../utils/textMapper.ts';

const CalendarCell = ({
  dayIndex,
  day,
  holiday,
  filteredEvents,
  notifiedEvents,
  onClick,
  droppableId,
}: {
  dayIndex: number;
  day: number | null;
  holiday: string;
  filteredEvents: Event[];
  notifiedEvents: string[];
  onClick: () => void;
  droppableId: string;
}) => {
  return (
    <TableCell
      key={dayIndex}
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: 1,
        border: '1px solid #e0e0e0',
        position: 'relative',
        cursor: day ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {day ? (
        <Droppable id={droppableId}>
          <>
            <Typography variant="body2" fontWeight="bold">
              {day}
            </Typography>
            {holiday && (
              <Typography variant="body2" color="error">
                {holiday}
              </Typography>
            )}
            {getEventsForDay(filteredEvents, day).map((event) => {
              const isNotified = notifiedEvents.includes(event.id);
              const isRepeating = event.repeat.type !== 'none';

              return (
                <Draggable id={event.id}>
                  <Box
                    key={event.id}
                    sx={{
                      p: 0.5,
                      my: 0.5,
                      backgroundColor: isNotified ? '#ffebee' : '#f5f5f5',
                      borderRadius: 1,
                      fontWeight: isNotified ? 'bold' : 'normal',
                      color: isNotified ? '#d32f2f' : 'inherit',
                      minHeight: '18px',
                      width: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {isNotified && <Notifications fontSize="small" />}
                      {/* ! TEST CASE */}
                      {isRepeating && (
                        <Tooltip
                          title={`${event.repeat.interval}${getRepeatTypeLabel(
                            event.repeat.type
                          )}마다 반복${
                            event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                          }`}
                        >
                          <Repeat fontSize="small" />
                        </Tooltip>
                      )}
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                      >
                        {event.title}
                      </Typography>
                    </Stack>
                  </Box>
                </Draggable>
              );
            })}
          </>
        </Droppable>
      ) : null}
    </TableCell>
  );
};

export default CalendarCell;
