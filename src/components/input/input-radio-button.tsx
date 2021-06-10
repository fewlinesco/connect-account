import React from "react";
import styled from "styled-components";

import { Separator } from "@src/components/separator/separator";
import { deviceBreakpoints } from "@src/design-system/theme";

const InputsRadio: React.FC<{
  groupName: string;
  inputsValues: string[];
  selectedInput: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isReady: boolean;
}> = ({ groupName, inputsValues, selectedInput, onChange, isReady }) => {
  return (
    <RadioGroup role="radiogroup" aria-label={groupName}>
      {inputsValues.map((inputValue) => {
        return (
          <React.Fragment key={groupName + inputValue}>
            <Label htmlFor={groupName + inputValue}>
              <p>{inputValue}</p>
              <RadioInputElement
                type="radio"
                id={groupName + inputValue}
                name={groupName}
                onChange={onChange}
                value={inputValue}
                checked={selectedInput === inputValue ? true : false}
              />
              {isReady ? <span /> : null}
            </Label>
            <Separator />
          </React.Fragment>
        );
      })}
    </RadioGroup>
  );
};

const RadioGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  line-height: ${({ theme }) => theme.lineHeights.copy};
  padding: 2.5rem ${({ theme }) => theme.spaces.xs};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.box};
  cursor: pointer;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
  }

  @media ${deviceBreakpoints.m} {
    padding: 2.5rem 1.5rem;
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
    outline: Highlight auto 0.1rem;
    outline: -webkit-focus-ring-color auto 0.1rem;
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

export { InputsRadio, Label };
