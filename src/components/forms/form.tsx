import React from "react";
import styled from "styled-components";

type FormProps = {
  formID?: string;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

const Form: React.FC<FormProps> = ({
  formID,
  onSubmit,
  children,
  className,
}) => {
  const [isNotSubmitted, setIsNotSubmitted] = React.useState(true);

  React.useEffect(() => {
    setIsNotSubmitted(true);
  }, [formID]);

  return (
    <StyledForm
      method="post"
      className={className}
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

const StyledForm = styled.form`
  display: column;
  align-items: center;
`;

export { Form, StyledForm };
