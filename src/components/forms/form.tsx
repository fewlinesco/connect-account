import React from "react";

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
    <form
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
    </form>
  );
};

export { Form };
