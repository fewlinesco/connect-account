import React from "react";
import { LocaleUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";

import classNames from "./day-picker.module.css";
import { formatDateMessage } from "@src/configs/intl";

import "react-day-picker/lib/style.css";

const YearMonthSelectors: React.FC<{
  date: Date;
  localeUtils: LocaleUtils;
  setYearMonth: React.Dispatch<
    React.SetStateAction<{
      month: Date;
      year?: Date;
    }>
  >;
}> = ({ date, localeUtils, setYearMonth }) => {
  const currentYear = new Date().getFullYear();
  const fromMonth = new Date(currentYear, 0);
  const toMonth = new Date(currentYear + 10, 11);
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void {
    // if (event.target.form) {
    //   const { year, month } = event.target.form;
    //   setYearMonth(new Date(year.value, month.value));
    // }

    return;
  };

  return (
    <div className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, index) => (
          <option key={month} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

const DatePicker: React.FC<{
  locale: string;
  date: Date;
  onDayChange: (date: Date) => void;
}> = ({ locale, date, onDayChange }) => {
  const [yearMonth, setYearMonth] = React.useState<{
    month: Date;
    year?: Date;
  }>({
    month: date,
  });

  const format = formatDateMessage(locale || "en", "format");
  return (
    <label
      className={`flex flex-col cursor-pointer ${classNames["day-picker"]}`}
    >
      <DayPickerInput
        onDayChange={onDayChange}
        format={format}
        placeholder={date
          .toISOString()
          .slice(0, date.toISOString().indexOf("T"))}
        dayPickerProps={{
          locale,
          month: date,
          toMonth: new Date(),
          disabledDays: [{ after: new Date() }],
          // labels: formatDateMessage(locale || "en", "datePickerLabels"),
          captionElement: ({ date, localeUtils }) => (
            <YearMonthSelectors
              date={date}
              localeUtils={localeUtils}
              setYearMonth={setYearMonth}
            />
          ),
        }}
      />
    </label>
  );
};

export { DatePicker };
