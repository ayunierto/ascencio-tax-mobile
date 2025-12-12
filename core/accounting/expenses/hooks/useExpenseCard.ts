import { DateTime } from 'luxon';

export const useExpenseCard = () => {
  /**
   * Converts a date string to a localized date-time string.
   *
   * @param date - The date string to be converted.
   * @returns The localized date-time string in the format "MM/DD/YYYY, hh:mm AM/PM" or `undefined` if the input is invalid.
   */
  const dateToLocaleDateTimeString = (date: string): string | undefined => {
    return DateTime.fromJSDate(new Date(date)).toLocaleString({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return {
    dateToLocaleDateTimeString,
  };
};
