import React from "react";
import styled from "styled-components";

import { Separator } from "@src/components/separator/separator";
import { deviceBreakpoints } from "@src/design-system/theme";

type InputRadioProps = {
  name: string;
  value: string;
  onChange: () => void;
};

const InputRadio: React.FC<{ inputsData: InputRadioProps[] }> = ({
  inputsData,
}) => {
  return (
    <div role="radiogroup" aria-label={inputsData[0].name}>
      {inputsData.map((input, index) => {
        return (
          <React.Fragment key={"radioInput" + Date.now() + index}>
            <Label htmlFor={"radioInput" + input.name + index}>
              {input.value}
              <RadioInputElement
                type="radio"
                id={"radioInput" + input.name + index}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                defaultChecked={index === 0 ? true : false}
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
    // This line is for mimicking Firefox native focus style on custom radios
    box-shadow: 0 0 5px 0 Highlight;
    // And this one for Chrome & Safari native focus style on custom radios
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

export type { InputRadioProps };

export { InputRadio };
