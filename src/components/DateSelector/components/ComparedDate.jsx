import { TIME_ZONE } from '@constants';
import { DatePicker, Stack, TextField } from '@shopify/polaris';
import { format, getMonth, getYear } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const DateWrapper = styled.div`
  padding-right: 20px;
  .Polaris-Stack > .Polaris-Stack__Item:first-child {
    width: 100%;
  }
`;
function ComparedDate({ onChangeDate, dates }) {
  const [{ month, year }, setDate] = useState({ month: getMonth(new Date()), year: getYear(new Date()) });
  const handleMonthChange = useCallback((month, year) => setDate({ month, year }), []);

  useEffect(() => {
    if (dates) handleMonthChange(getMonth(dates.start), getYear(dates.start));
  }, [dates]);

  return (
    dates && (
      <DateWrapper>
        <Stack>
          <Stack.Item>
            <TextField fullWidth label="Compared" value={`${format(dates?.start, 'MM/dd/yyyy')} - ${format(dates?.end, 'MM/dd/yyyy')}`} />
          </Stack.Item>
          <Stack.Item>
            <DatePicker
              month={month}
              year={year}
              onChange={onChangeDate}
              onMonthChange={handleMonthChange}
              selected={dates}
              allowRange
              disableDatesAfter={utcToZonedTime(new Date(), TIME_ZONE)}
            />
          </Stack.Item>
        </Stack>
      </DateWrapper>
    )
  );
}

export default ComparedDate;
