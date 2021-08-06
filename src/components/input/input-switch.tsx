import React from "react";
import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

const InputSwitch: React.FC<{
  groupName: string;
  labelText: string;
  isSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ groupName, labelText, isSelected, onChange }) => {
  return (
    <Label htmlFor={labelText}>
      <p>{labelText}</p>
      <SwitchInputElement
        type="checkbox"
        id={labelText}
        name={groupName}
        onChange={onChange}
        value={labelText}
        checked={isSelected}
      />
      <span />
    </Label>
  );
};

const Label = styled.label`
  position: relative;
  display: flex;
  align-items: start;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;

  span {
    position: relative;
    width: 3.6rem;
    height: 1.8rem;
    background-color: ${({ theme }) => theme.colors.separator};
    border-radius: ${({ theme }) => theme.radii[2]};

    :after {
      content: "";
      height: 1.4rem;
      width: 1.4rem;
      position: absolute;
      background-color: ${({ theme }) => theme.colors.lightGrey};
      border-radius: ${({ theme }) => theme.radii[3]};
      top: 0.2rem;
      left: 0.2rem;
      transition: all 0.2s cubic-bezier(0.5, 0.1, 0.75, 1.35);
    }
  }

  input:checked + span:after {
    background-color: ${({ theme }) => theme.colors.primary};
    left: 2rem;
  }

  @media ${deviceBreakpoints.m} {
    span {
      height: 2rem;

      :after {
        height: 1.6rem;
        width: 1.6rem;
      }
    }

    input:checked + span:after {
      left: 1.8rem;
    }
  }
`;

const SwitchInputElement = styled.input`
  border: 0;
  clip-path: circle(0%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;

export { InputSwitch };
