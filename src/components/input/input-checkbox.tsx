import React from "react";
import styled from "styled-components";

type CheckboxProps = {
  name: string;
  onChange: () => void;
  label: string;
};

const InputCheckbox: React.FC<CheckboxProps> = (props) => {
  const { label, name, onChange } = props;

  return (
    <Label>
      <CheckboxElement type="checkbox" name={name} onChange={onChange} />
      {label}
    </Label>
  );
};

const CheckboxElement = styled.input<Record<string, unknown>>`
  width: 1.8rem;
  height: 1.6rem;
  margin: 0 ${({ theme }) => theme.spaces.xxs} 0 0;
  cursor: pointer;
`;

const Label = styled.label`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
`;

export { InputCheckbox };
