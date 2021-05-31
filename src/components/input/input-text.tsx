import { useTextField } from "@react-aria/textfield";
import React from "react";
import styled from "styled-components";

type InputTextProps = {
  type: string;
  name: string;
  label: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  children?: React.ReactNode;
  errorMessage?: string;
};

const InputText: React.FC<InputTextProps> = (props) => {
  const { label, className, children, errorMessage } = props;

  const inputRef = React.useRef(null);
  const { labelProps, inputProps } = useTextField(props, inputRef);

  return (
    <Label {...labelProps}>
      {label}
      {children ? (
        <ChildrenWrapper>
          {children}
          <InputElement
            {...inputProps}
            ref={inputRef}
            className={className}
            errorMessage={errorMessage}
          />
        </ChildrenWrapper>
      ) : (
        <InputElement
          {...inputProps}
          ref={inputRef}
          className={className}
          errorMessage={errorMessage}
        />
      )}
      {errorMessage ? <ErrorMessage>error</ErrorMessage> : null}
    </Label>
  );
};

const InputElement = styled.input<Record<string, unknown>>`
  background: ${({ theme }) => theme.colors.background};
  border: 0.1rem solid ${({ theme }) => theme.colors.blacks[2]};
  border-radius: ${({ theme }) => theme.radii[0]};
  border-color: ${({ errorMessage, theme }) =>
    errorMessage ? theme.colors.red : "black"};
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
    outline: Highlight auto 0.1rem;
    outline: -webkit-focus-ring-color auto 0.1rem;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.red};
  margin-bottom: 2rem;
`;

export { InputText };
