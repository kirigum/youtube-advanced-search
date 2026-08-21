import { startOfDay, startOfMonth, startOfWeek, startOfYear } from 'date-fns';

import { DateType } from './DatePicker';

export const isDateRangeInvalid = (from?: Date, to?: Date) =>
  from !== undefined && to !== undefined && from > to;

export const getDateByType = (dateType: DateType) => {
  const now = new Date();

  switch (dateType) {
    case 'today':
      return startOfDay(now);
    case 'this-week':
      return startOfWeek(now, { weekStartsOn: 1 });
    case 'this-month':
      return startOfMonth(now);
    case 'this-year':
      return startOfYear(now);
    default:
      return undefined;
  }
};