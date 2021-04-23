import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styled from "styled-components";

import { SkeletonTextLine } from "../skeletons/skeletons";

type InputDayPickerProps = {
  label: string;
  selected?: string;
  onChange: (date: Date) => void;
};

const InputDayPicker: React.FC<InputDayPickerProps> = ({
  label,
  selected,
  onChange,
}) => {
  return (
    <Label>
      {label}
      {selected ? (
        <DayPickerInput value={selected} onDayChange={onChange} />
      ) : (
        <SkeletonTextLine fontSize={1.4} />
      )}
    </Label>
  );
};

const Label = styled.label`
  display: flex;
  flex-direction: column;

  .DayPickerInput {
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

export { InputDayPicker };
