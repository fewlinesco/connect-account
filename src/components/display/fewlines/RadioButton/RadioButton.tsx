import React from "react";
import styled from "styled-components";

type RadioButtonProps = {
  name: string;
  checked: boolean;
};

export const RadioButton: React.FC<RadioButtonProps> = ({ name, checked }) => {
  return (
    <Wrapper>
      <label>
        <input type="radio" name={name} defaultChecked={checked} />
        <span className="circle"></span>
      </label>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  label {
    position: relative;
    cursor: pointer;
    user-select: none;
    padding-left: 3rem;
  }

  label input {
    display: none;
  }

  label span {
    width: 2rem;
    height: 2rem;
    background-color: white;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: ${({ theme }) => theme.radii[3]};
    border: ${({ theme }) => theme.borders.normal} black;
  }

  label input:checked + span {
    border: ${({ theme }) => theme.borders.normal}
      ${({ theme }) => theme.colors.primary};
  }

  label input:checked + span:after {
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
