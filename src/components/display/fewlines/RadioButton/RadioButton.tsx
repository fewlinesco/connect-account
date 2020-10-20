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
    top: -10px;
    cursor: pointer;
    user-select: none;
    padding-left: 30px;
  }

  .radio-container input {
    display: none;
  }

  .radio-container .circle {
    width: 20px;
    height: 20px;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    border: 2px solid black;
  }

  .radio-container input:checked + .circle {
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  .radio-container input:checked + .circle:after {
    content: "";
    height: 10px;
    width: 10px;
    background-color: ${({ theme }) => theme.colors.primary};
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
