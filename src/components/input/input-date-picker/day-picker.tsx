import React from "react";
import { LocaleUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";

import classNames from "./day-picker.module.css";
import { formatDateMessage } from "@src/configs/intl";
import localeUtils, { formatDate } from "@src/utils/dates";

import "react-day-picker/lib/style.css";

const InputDayPicker: React.FC<{
  isValidating: boolean;
  date: Date;
  onDayChange: (date: Date) => void;
  label: string;
  locale?: string;
}> = ({ locale, date, onDayChange, label, isValidating }) => {
  const [selectedDate, setSelectedMonth] = React.useState<Date>(date);

  return (
    <label
      className={`flex flex-col cursor-pointer ${classNames["day-picker"]}`}
    >
      {label}
      <DayPickerInput
        onDayChange={(date) => {
          onDayChange(date);
        }}
        format={formatDateMessage(locale || "en", "format")}
        placeholder={isValidating ? "" : formatDate(date, locale)}
        dayPickerProps={{
          localeUtils,
          locale,
          month: date,
          fixedWeeks: true,
          disabledDays: [{ after: new Date() }],
          captionElement: ({ localeUtils, locale }) => (
            <YearMonthSelectors
              localeUtils={localeUtils}
              locale={locale}
              selectedDate={selectedDate}
              setSelectedMonth={setSelectedMonth}
            />
          ),
        }}
      />
    </label>
  );
};

const YearMonthSelectors: React.FC<{
  localeUtils: LocaleUtils;
  locale: string;
  selectedDate: Date;
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date>>;
}> = ({ localeUtils, locale, selectedDate, setSelectedMonth }) => {
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
          return setSelectedMonth(
            new Date(selectedDate.setMonth(parseInt(event.target.value))),
          );
        }}
        value={selectedDate.getMonth()}
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
          return setSelectedMonth(
            new Date(selectedDate.setFullYear(parseInt(event.target.value))),
          );
        }}
        value={selectedDate.getFullYear()}
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

export { InputDayPicker };
