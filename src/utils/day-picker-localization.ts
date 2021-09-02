import { LocaleUtils } from "react-day-picker";

import { formatDateMessage } from "@src/configs/intl";

// function formatDate(
//   date: Date,
//   format?: string | string[],
//   locale?: string,
// ): string {
//   return "";
// }

function formatDay(date: Date, locale = "en"): string {
  const months = formatDateMessage(locale, "months").split("");
  const weekdaysLong = formatDateMessage(locale, "weekdaysLong").split("");

  return `${weekdaysLong[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
}

function formatMonthTitle(date: Date, locale = "en"): string {
  const months = formatDateMessage(locale, "months").split("");

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatWeekdayShort(weekdayIndex: number, locale = "en"): string {
  return formatDateMessage(locale, "weekdaysShort").split(" ")[weekdayIndex];
}

function formatWeekdayLong(weekdayIndex: number, locale = "en"): string {
  return formatDateMessage(locale, "weekdaysLong").split(" ")[weekdayIndex];
}

function getFirstDayOfWeek(locale = "en"): number {
  return parseInt(formatDateMessage(locale, "firstDayOfTheWeek"));
}

function getMonths(
  locale = "en",
): [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] {
  const months = formatDateMessage(locale, "months").split(" ");

  if (months.length === 12) {
    return months as [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ];
  }

  throw new Error(
    `Wrong number of month in localized string from '${locale}' hash.`,
  );
}

// function parseDate(str: string, format?: string, locale?: string): Date {
//   return new Date();
// }

const localeUtils = {
  ...LocaleUtils,
  // formatDate,
  formatDay,
  formatMonthTitle,
  formatWeekdayShort,
  formatWeekdayLong,
  getFirstDayOfWeek,
  getMonths,
  // parseDate,
};

export {
  // formatDate,
  formatDay,
  formatMonthTitle,
  formatWeekdayShort,
  formatWeekdayLong,
  getFirstDayOfWeek,
  getMonths,
  // parseDate,
};
export default localeUtils;
