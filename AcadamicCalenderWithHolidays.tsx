import React, { JSX, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { useSelector } from 'react-redux';

// Styled Components
const GradientBox = styled(Box)`
  background: linear-gradient(135deg, #f48665 0%, #fda23f 100%);
  color: white;
  border-radius: 8px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  padding: 16px;
  margin-bottom: 16px;
  text-align: center;
  font-weight: bold;
`;

const StyledDate = styled(Box)`
  border-radius: 8px;
  background: #fff;
  color: #000;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 0.2 / 0.1;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

export default function PremiumCalendar() {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [view, setView] = useState<'calendar' | 'holidays'>('calendar');

  const academicCalendarResponse = useSelector(
    (state: any) => state.academicCalendar?.data
  );

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const newYear = Number(event.target.value);
    setCurrentDate(currentDate.year(newYear));
  };

  const generateCalendar = () => {
    const startOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const currentYear = currentDate.year();
    const calendarDays: JSX.Element[] = [];

    for (let i = 0; i < startOfMonth.day(); i++) {
      calendarDays.push(<Box key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = currentDate.date(day).format('YYYY-MM-DD');

      const holiday = academicCalendarResponse?.find(
        (event: any) =>
          dayjs(event.start_date).startOf('day').year() === currentYear &&
          dayjs(date).isBetween(
            dayjs(event.start_date).startOf('day'),
            dayjs(event.end_date).endOf('day'),
            null,
            '[]'
          )
      );

      calendarDays.push(
        <StyledDate
          key={date}
          sx={{
            background: holiday ? '#f48665' : '',
            position: 'relative',
          }}
        >
          <Typography
            sx={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}
          >
            {day}
          </Typography>
          {holiday && (
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'medium',
                position: 'absolute',
                bottom: '4px',
                textAlign: 'center',
                color: '#ffffff',
                padding: '2px',
                borderRadius: '4px',
                width: '100%',
              }}
            >
              {holiday.name}
            </Typography>
          )}
        </StyledDate>
      );
    }

    return calendarDays;
  };

  const renderHolidayList = () => {
    const holidays = academicCalendarResponse?.filter(
      (event: any) => dayjs(event.start_date).year() === currentDate.year()
    );

    return (
      <Box>
        {holidays && holidays.length > 0 ? (
          holidays.map((holiday: any, index: number) => (
            <Box
              key={index}
              sx={{
                background: '#fff',
                color: '#4fa2fa',
                borderRadius: 2,
                padding: 1.5,
                marginBottom: 1,
                boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
              }}
            >
              <Typography variant="h6">{holiday.name}</Typography>
              <Typography variant="body2">
                {dayjs(holiday.start_date).format('DD MMM YYYY')} -{' '}
                {dayjs(holiday.end_date).format('DD MMM YYYY')}
              </Typography>
            </Box>
          ))
        ) : (
          <div className="no-holidays">
            <Typography>No holidays found for this year.</Typography>
          </div>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <GradientBox
        sx={{
          padding: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {view === 'calendar' && (
          <IconButton
            onClick={handlePreviousMonth}
            color="inherit"
            size="small"
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
        )}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {view === 'calendar' && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ marginX: 1, fontWeight: 'bold' }}
              >
                {currentDate.format('MMMM')}
              </Typography>

              <Select
                value={currentDate.year()}
                onChange={handleYearChange}
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 1,
                }}
              >
                {[...Array(11)].map((_, i) => {
                  const year = dayjs().year() - 5 + i;
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  );
                })}
              </Select>
            </>
          )}
          <Button
            onClick={() =>
              setView(view === 'calendar' ? 'holidays' : 'calendar')
            }
            variant="contained"
            sx={{ marginLeft: 2, background: '#4fa2fa', color: 'white' }}
          >
            {view === 'calendar' ? 'View Holidays' : 'Back to Calendar'}
          </Button>
        </div>

        <IconButton onClick={handleNextMonth} color="inherit" size="small">
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </GradientBox>

      {view === 'calendar' ? (
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={0.5}>
          {daysOfWeek.map((day) => (
            <Typography
              key={day}
              sx={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              {day}
            </Typography>
          ))}
          {generateCalendar()}
        </Box>
      ) : (
        renderHolidayList()
      )}
    </Box>
  );
}
