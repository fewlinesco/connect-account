import React from "react";
import { LocaleUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";

import classNames from "./day-picker.module.css";
import { formatDateMessage } from "@src/configs/intl";
import localeUtils from "@src/utils/day-picker-localization";

import "react-day-picker/lib/style.css";

const DatePicker: React.FC<{
  isValidating: boolean;
  date: Date;
  onDayChange: (date: Date) => void;
  label: string;
  locale?: string;
}> = ({ locale, date, onDayChange, label, isValidating }) => {
  const [yearMonth, setYearMonth] = React.useState<{
    month: number;
    year: number;
  }>({
    month: date.getMonth(),
    year: date.getFullYear(),
  });

  return (
    <label
      className={`flex flex-col cursor-pointer ${classNames["day-picker"]}`}
    >
      {label}
      <DayPickerInput
        onDayChange={(date) => {
          console.log("FLAG", date);
          onDayChange(date);
        }}
        format={formatDateMessage(locale || "en", "format")}
        placeholder={
          isValidating
            ? ""
            : date.toISOString().slice(0, date.toISOString().indexOf("T"))
        }
        dayPickerProps={{
          localeUtils,
          locale,
          month: date,
          fixedWeeks: true,
          disabledDays: [{ after: new Date() }],
          captionElement: ({ date, localeUtils, locale }) => (
            <YearMonthSelectors
              date={date}
              localeUtils={localeUtils}
              locale={locale}
            />
          ),
        }}
      />
    </label>
  );
};

const YearMonthSelectors: React.FC<{
  date: Date;
  localeUtils: LocaleUtils;
  locale: string;
  yearMonth?: React.SetStateAction<{
    month: Date;
    year?: Date;
  }>;
  setYearMonth?: React.Dispatch<
    React.SetStateAction<{
      month: Date;
      year?: Date;
    }>
  >;
}> = ({ date, localeUtils, locale, setYearMonth }) => {
  const currentYear = new Date().getFullYear();
  const fromMonth = new Date(currentYear - 130, 0);
  const toMonth = new Date();
  const months = localeUtils.getMonths(locale);

  const years: number[] = [];
  for (
    let index = fromMonth.getFullYear();
    index <= toMonth.getFullYear();
    index += 1
  ) {
    years.push(index);
  }

  return (
    <div className="DayPicker-Caption">
      <select
        name="month"
        onChange={(event) => {
          const selectedMonth = months[parseInt(event.target.value)];
          console.log(selectedMonth);
        }}
        value={date.getMonth()}
      >
        {months.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select
        name="year"
        onChange={(event) => {
          console.log(event.target.value);
        }}
        value={date.getFullYear()}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export { DatePicker };
