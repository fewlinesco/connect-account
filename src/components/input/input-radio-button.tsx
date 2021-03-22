import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { Separator } from "@src/components/separator/separator";
import { deviceBreakpoints } from "@src/design-system/theme";

const InputsRadio: React.FC<{
  groupName: string;
  inputsValues: string[];
  selectedInput: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ groupName, inputsValues, selectedInput, onChange }) => {
  return (
    <div role="radiogroup" aria-label={groupName}>
      {inputsValues.map((inputValue) => {
        const inputId = uuidv4();
        return (
          <React.Fragment key={inputId}>
            <Label htmlFor={inputId}>
              {inputValue}
              <RadioInputElement
                type="radio"
                id={inputId}
                name={groupName}
                onChange={onChange}
                value={inputValue}
                checked={selectedInput === inputValue ? true : false}
              />
              <span />
            </Label>
            <Separator />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Label = styled.label`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  height: 6.8rem;
  cursor: pointer;

  @media ${deviceBreakpoints.m} {
    padding: 0 ${({ theme }) => theme.spaces.xxs};
  }

  span {
    position: relative;
    width: 2rem;
    height: 2rem;
    background-color: white;
    border-radius: ${({ theme }) => theme.radii[3]};
    border: ${({ theme }) => theme.borders.normal} black;
  }

  input:checked + span {
    border: ${({ theme }) => theme.borders.normal};
  }

  input:checked + span:after {
    content: "";
    height: 1rem;
    width: 1rem;
    background-color: ${({ theme }) => theme.colors.primary};
    position: absolute;
    border-radius: ${({ theme }) => theme.radii[3]};
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  input:focus + span {
    outline: Highlight auto 1px;
    outline: -webkit-focus-ring-color auto 1px;
  }
`;

const RadioInputElement = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

export { InputsRadio };
