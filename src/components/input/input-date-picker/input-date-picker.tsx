import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import classes from "./input-date-picker.module.css";

type InputDatePickerProps = {
  label: string;
  selected?: string;
  onChange: (date: Date) => void;
};

const InputDatePicker: React.FC<InputDatePickerProps> = ({
  label,
  selected,
  onChange,
}) => {
  return (
    <label className={`flex flex-col mb-8 ${classes.inputDatePicker}`}>
      {label}
      <DatePicker
        selected={selected ? new Date(selected) : new Date()}
        onChange={onChange}
        dateFormat={"yyyy-MM-dd"}
        maxDate={new Date()}
        showMonthDropdown
        showYearDropdown
        yearDropdownItemNumber={120}
        scrollableYearDropdown
      />
    </label>
  );
};

export { InputDatePicker };
