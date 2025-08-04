import { Timezone } from '../types';

export const TIMEZONES: Timezone[] = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)', offset: '-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)', offset: '-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)', offset: '-08:00' },
  { value: 'America/Anchorage', label: 'Alaska Time', offset: '-09:00' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time', offset: '-10:00' },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Central European Time', offset: '+01:00' },
  { value: 'Europe/Berlin', label: 'Berlin Time', offset: '+01:00' },
  { value: 'Europe/Rome', label: 'Rome Time', offset: '+01:00' },
  { value: 'Europe/Madrid', label: 'Madrid Time', offset: '+01:00' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam Time', offset: '+01:00' },
  { value: 'Europe/Stockholm', label: 'Stockholm Time', offset: '+01:00' },
  { value: 'Europe/Helsinki', label: 'Helsinki Time', offset: '+02:00' },
  { value: 'Europe/Athens', label: 'Athens Time', offset: '+02:00' },
  { value: 'Europe/Moscow', label: 'Moscow Time', offset: '+03:00' },
  { value: 'Asia/Dubai', label: 'Dubai Time', offset: '+04:00' },
  { value: 'Asia/Karachi', label: 'Pakistan Time', offset: '+05:00' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: '+05:30' },
  { value: 'Asia/Dhaka', label: 'Bangladesh Time', offset: '+06:00' },
  { value: 'Asia/Bangkok', label: 'Thailand Time', offset: '+07:00' },
  { value: 'Asia/Singapore', label: 'Singapore Time', offset: '+08:00' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time', offset: '+08:00' },
  { value: 'Asia/Shanghai', label: 'China Standard Time', offset: '+08:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: '+09:00' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time', offset: '+09:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: '+10:00' },
  { value: 'Australia/Melbourne', label: 'Australian Eastern Time', offset: '+10:00' },
  { value: 'Australia/Brisbane', label: 'Australian Eastern Time', offset: '+10:00' },
  { value: 'Australia/Perth', label: 'Australian Western Time', offset: '+08:00' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time', offset: '+12:00' },
];

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDateInTimezone = (date: Date, timezone: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export const convertToUTC = (dateString: string, timezone: string): string => {
  const date = new Date(dateString);
  return date.toISOString();
};

export const convertFromUTC = (utcString: string, timezone: string): string => {
  const date = new Date(utcString);
  return formatDateInTimezone(date, timezone);
};