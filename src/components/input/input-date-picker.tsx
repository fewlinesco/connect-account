import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";

import { SkeletonTextLine } from "../skeletons/skeletons";

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
    <>
      <Label>
        {label}
        {selected ? (
          <DatePicker
            selected={new Date(selected)}
            onChange={onChange}
            dateFormat={"yyyy-MM-dd"}
          />
        ) : (
          <SkeletonTextLine fontSize={1.4} />
        )}
      </Label>
    </>
  );
};

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

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
      margin: ${({ theme }) => theme.spaces.xxs} 0 0;
      z-index: 1;
      position: relative;
    }
  }
`;

export { InputDatePicker };
