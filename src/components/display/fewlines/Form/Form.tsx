import React from "react";
import styled from "styled-components";

type FormProps = {
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  children: React.ReactNode | React.ReactNode[];
};

export const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  const [isNotSubmitted, setIsNotSubmitted] = React.useState(true);

  return (
    <StyledForm
      method="post"
      onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsNotSubmitted(false);

        if (isNotSubmitted) {
          await onSubmit();
        }
      }}
    >
      {children}
    </StyledForm>
  );
};

export const StyledForm = styled.form`
  display: column;
  align-items: center;
`;
