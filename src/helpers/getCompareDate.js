import { differenceInDays, subDays } from 'date-fns';

const getCompareDate = (dates) => {
  const { start, end } = dates;

  const distance = differenceInDays(end, start);
  const prevEnd = subDays(new Date(start), 1);

  const prevStart = subDays(prevEnd, distance);

  return {
    start: prevStart,
    end: prevEnd,
  };
};

export default getCompareDate;
