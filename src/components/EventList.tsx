import { FormControl, FormLabel, Stack, TextField, Typography } from '@mui/material';

import { Event } from '../types.ts';
import EventCard from './EventCard.tsx';

const EventList = ({
  searchTerm,
  setSearchTerm,
  filteredEvents,
  notifiedEvents,
  handleEditEvent,
  handleDeleteEvent,
}: {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  filteredEvents: Event[];
  notifiedEvents: string[];
  handleEditEvent: (event: Event) => void;
  handleDeleteEvent: (event: Event) => void;
}) => {
  return (
    <Stack
      data-testid="event-list"
      spacing={2}
      sx={{ width: '30%', height: '100%', overflowY: 'auto' }}
    >
      <FormControl fullWidth>
        <FormLabel htmlFor="search">일정 검색</FormLabel>
        <TextField
          id="search"
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormControl>

      {filteredEvents.length === 0 ? (
        <Typography>검색 결과가 없습니다.</Typography>
      ) : (
        filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            notifiedEvents={notifiedEvents}
            handleClickEdit={() => handleEditEvent(event)}
            handleClickDelete={() => handleDeleteEvent(event)}
          />
        ))
      )}
    </Stack>
  );
};

export default EventList;
