import React from "react";
import styled from "styled-components";

type RadioButtonProps = {
  name: string;
  checked: boolean;
};

export const RadioButton: React.FC<RadioButtonProps> = ({ name, checked }) => {
  return (
    <Wrapper>
      <label className="radio-container">
        <input type="radio" name={name} checked={checked} />
        <span className="circle"></span>
      </label>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .radio-container {
    position: relative;
    cursor: pointer;
    user-select: none;
    padding-left: 3rem;
  }

  .radio-container input {
    display: none;
  }

  .radio-container .circle {
    width: 2rem;
    height: 2rem;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: ${({ theme }) => theme.radii[3]};
    border: ${({ theme }) => theme.borders.normal} black;
  }

  .radio-container input:checked + .circle {
    border: ${({ theme }) => theme.borders.normal}
      ${({ theme }) => theme.colors.primary};
  }

  .radio-container input:checked + .circle:after {
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
`;
