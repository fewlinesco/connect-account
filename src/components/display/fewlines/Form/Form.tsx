import React from "react";

type FormProps = {
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  children: React.ReactNode | React.ReactNode[];
};

export const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  const [isNotSubmitted, setIsNotSubmitted] = React.useState(true);

  return (
    <form
      method="post"
      onSubmit={async (event) => {
        event.preventDefault();

        setIsNotSubmitted(false);

        if (isNotSubmitted) {
          await onSubmit();
        }
      }}
    >
      {children}
    </form>
  );
};
