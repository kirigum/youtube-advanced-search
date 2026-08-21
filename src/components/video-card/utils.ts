import { parseISO8601Duration } from '@/utils';

export const getFlagEmoji = (countryCode?: string) => {
  if (!countryCode) {
    return '';
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

const padNumber = (num: number) => num.toString().padStart(2, '0');

export const formatDuration = (duration: string) => {
  const { hours, minutes, seconds } = parseISO8601Duration(duration);

  if (hours > 0) {
    return `${hours}:${padNumber(minutes)}:${padNumber(seconds)}`;
  }

  return `${minutes}:${padNumber(seconds)}`;
};
