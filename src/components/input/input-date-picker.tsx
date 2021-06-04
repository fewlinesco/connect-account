import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";

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
    <Label>
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
    </Label>
  );
};

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin: 0 0 ${({ theme }) => theme.spaces.xs};

  .react-datepicker-wrapper {
    width: 100%;
    input {
      width: 100%;
      background: ${({ theme }) => theme.colors.background};
      border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
      border-radius: ${({ theme }) => theme.radii[0]};
      height: 4rem;
      padding-left: 1.6rem;
      width: 100%;
      margin-top: ${({ theme }) => theme.spaces.xxs};
      z-index: 1;
      position: relative;
    }
  }

  .react-datepicker {
    font-size: ${({ theme }) => theme.fontSizes.xxs};
  }

  .react-datepicker-popper {
    z-index: 3;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    width: 2.5rem;
    line-height: 2.5rem;
  }

  .react-datepicker__current-month {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }

  .react-datepicker__header__dropdown--scroll {
    padding-top: 0.8rem;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    display: flex;
    justify-content: space-evenly;
  }
`;

export { InputDatePicker };
