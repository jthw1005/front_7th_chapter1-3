import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  IconButton,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { Event } from '../types.ts';
import CalendarCell from './CalendarCell.tsx';
import {
  formatDate,
  formatMonth,
  formatWeek,
  getWeekDates,
  getWeeksAtMonth,
} from '../utils/dateUtils.ts';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const EventView = ({
  currentDate,
  filteredEvents,
  notifiedEvents,
  view,
  holidays,
  navigate,
  setView,
  onEventUpdate,
  onDateClick,
}: {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  view: 'week' | 'month';
  holidays: { [key: string]: string };
  navigate: (direction: 'prev' | 'next') => void;
  setView: (view: 'week' | 'month') => void;
  onEventUpdate: (event: Event) => void;
  onDateClick?: (date: string) => void;
}) => {
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    // console.log(weekDates);
    return (
      <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatWeek(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHeader />
            <TableBody>
              <TableRow>
                {weekDates.map((date, dateIndex) => {
                  const day = date.getDate();
                  const dateString = formatDate(currentDate, day);
                  const droppableId = dateString;
                  const holiday = holidays[dateString];

                  const handleClickDay = () => {
                    if (onDateClick) {
                      onDateClick(droppableId);
                    }
                  };

                  return (
                    <CalendarCell
                      dayIndex={dateIndex}
                      day={day}
                      holiday={holiday}
                      filteredEvents={filteredEvents}
                      notifiedEvents={notifiedEvents}
                      onClick={handleClickDay}
                      droppableId={droppableId}
                    />
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  const renderMonthView = () => {
    const weeks = getWeeksAtMonth(currentDate);

    return (
      <Stack data-testid="month-view" spacing={4} sx={{ width: '100%' }}>
        <Typography variant="h5">{formatMonth(currentDate)}</Typography>
        <TableContainer>
          <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHeader />
            <TableBody>
              {weeks.map((week, weekIndex) => (
                <TableRow key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    const dateString = day ? formatDate(currentDate, day) : '';
                    const holiday = holidays[dateString];
                    const droppableId = dateString;

                    const handleClickDay = () => {
                      if (dateString && onDateClick) {
                        onDateClick(dateString);
                      }
                    };

                    return (
                      <CalendarCell
                        dayIndex={dayIndex}
                        day={day}
                        holiday={holiday}
                        filteredEvents={filteredEvents}
                        notifiedEvents={notifiedEvents}
                        onClick={handleClickDay}
                        droppableId={droppableId}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const eventId = event.active.id as string;
      const newDate = event.over.id as string;

      const draggedEvent = filteredEvents.find((e) => e.id === eventId);
      if (!draggedEvent) {
        return;
      }

      if (draggedEvent.date === newDate) {
        return;
      }

      const updatedEvent: Event = {
        ...draggedEvent,
        date: newDate,
        repeat: {
          type: 'none',
          interval: 0,
          endDate: '',
        },
      };

      onEventUpdate(updatedEvent);
    }
  };

  return (
    <Stack flex={1} spacing={5}>
      <Typography variant="h4">일정 보기</Typography>

      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
        <IconButton aria-label="Previous" onClick={() => navigate('prev')}>
          <ChevronLeft />
        </IconButton>
        <Select
          size="small"
          aria-label="뷰 타입 선택"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <MenuItem value="week" aria-label="week-option">
            Week
          </MenuItem>
          <MenuItem value="month" aria-label="month-option">
            Month
          </MenuItem>
        </Select>
        <IconButton aria-label="Next" onClick={() => navigate('next')}>
          <ChevronRight />
        </IconButton>
      </Stack>

      <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </DndContext>
    </Stack>
  );
};

export default EventView;

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        {weekDays.map((day) => (
          <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
            {day}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
