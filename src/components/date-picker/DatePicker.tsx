import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getDateByType, isDateRangeInvalid } from './utils';

export type DateType = 'any' | 'today' | 'this-week' | 'this-month' | 'this-year' | 'custom';

export type DateData = {
  from?: Date;
  to?: Date;
  isInvalid: boolean;
};

export interface DatePickerProps {
  label?: string;
  onDateChange?: (dateData: DateData) => void;
}

export const DatePicker: FC<DatePickerProps> = ({
  label,
  onDateChange,
}) => {
  const [dateType, setDateType] = useState<DateType>('any');
  const [dateData, setDateData] = useState<DateData>({ isInvalid: false });

  useEffect(() => {
    onDateChange?.(dateData);
  }, [dateData, onDateChange]);

  const handleDateTypeChange = (value: DateType) => {
    setDateType(value);

    if (value !== 'custom') {
      setDateData({
        from: getDateByType(value),
        to: undefined,
        isInvalid: false,
      });
    } else {
      setDateData({
        isInvalid: false,
      });
    }
  };

  const handleCustomDateChange = (field: 'from' | 'to', date?: Date) => {
    if (field === 'from') {
      setDateData((prev) => ({
        ...prev,
        from: date,
        isInvalid: isDateRangeInvalid(date, prev.to),
      }));
    } else {
      setDateData((prev) => ({
        ...prev,
        to: date,
        isInvalid: isDateRangeInvalid(prev.from, date),
      }));
    }
  };

  const customDates = [
    { field: 'from' as const, date: dateData?.from, emptyLabel: 'From date' },
    { field: 'to' as const, date: dateData?.to, emptyLabel: 'To date' },
  ];

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Label>
      )}

      <Select value={dateType} onValueChange={handleDateTypeChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
          <SelectItem value="custom">Custom Range...</SelectItem>
        </SelectContent>
      </Select>

      {dateType === 'custom' && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {customDates.map(({ field, date, emptyLabel }) => (
            <Popover key={field}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full px-2 text-xs justify-start font-normal bg-background',
                    !date && 'text-muted-foreground',
                    dateData?.isInvalid && 'border-destructive',
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {date ? format(date, 'MMM d, yyyy') : emptyLabel}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(nextDate) => handleCustomDateChange(field, nextDate)}
                />
              </PopoverContent>
            </Popover>
          ))}
          {dateData?.isInvalid && (
            <p className="col-span-2 text-xs text-destructive font-medium">Invalid date range.</p>
          )}
        </div>
      )}
    </div>
  );
};