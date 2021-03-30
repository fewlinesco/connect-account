import { useTextField } from "@react-aria/textfield";
import React from "react";
import styled from "styled-components";

type InputTextProps = {
  type: string;
  name: string;
  label: string;
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  children?: React.ReactNode;
};

const InputText: React.FC<InputTextProps> = (props) => {
  const { label, className, children } = props;

  const inputRef = React.useRef(null);
  const { labelProps, inputProps } = useTextField(props, inputRef);

  return (
    <Label {...labelProps}>
      {label}
      {children ? (
        <ChildrenWrapper>
          {children}
          <InputElement {...inputProps} ref={inputRef} className={className} />
        </ChildrenWrapper>
      ) : (
        <InputElement {...inputProps} ref={inputRef} className={className} />
      )}
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
  z-index: 1;
  position: relative;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGrey};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const ChildrenWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;

  input {
    outline: none;
  }

  :focus-within span {
    outline: Highlight auto 1px;
    outline: -webkit-focus-ring-color auto 1px;
  }
`;

export { InputText };
