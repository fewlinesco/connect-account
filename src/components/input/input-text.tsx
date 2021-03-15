import { useTextField } from "@react-aria/textfield";
import React from "react";
import styled from "styled-components";

// import { StyledPhoneInput } from "./styled-phone-input";

interface InputProps {
  type: string;
  name: string;
  label: string;
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  defaultCountry?: string;
}

const InputText: React.FC<InputProps> = (props) => {
  const { label } = props;

  const inputRef = React.useRef(null);
  const { labelProps, inputProps } = useTextField(props, inputRef);

  return (
    <Label {...labelProps}>
      {label}
      <InputElement {...inputProps} ref={inputRef} />
    </Label>
  );
};

const InputElement = styled.input<Record<string, unknown>>`
  background: ${({ theme }) => theme.colors.background};
  border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
  border-radius: ${({ theme }) => theme.radii[0]};
  height: 4rem;
  padding-left: 1.6rem;
  width: 100%;
  margin: ${({ theme }) => theme.spaces.xxs} 0 ${({ theme }) => theme.spaces.xs};

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGrey};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }

  /* &[type="checkbox"] {
    width: 18px;
    height: 1.6rem;
    margin: 0 ${({ theme }) => theme.spaces.xxs} 0 0;
    cursor: pointer;
  } */
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

export { InputText };
