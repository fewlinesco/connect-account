import { useTextField } from "@react-aria/textfield";
import React from "react";

import classes from "./input-text.module.css";

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
  required?: boolean;
};

const InputText: React.FC<InputTextProps> = (props) => {
  const { label, children, required } = props;

  const inputRef = React.useRef(null);
  const { labelProps, inputProps } = useTextField(props, inputRef);

  return (
    <label className="flex flex-col cursor-pointer" {...labelProps}>
      {label}
      {children ? (
        <div
          className={
            "relative flex justify-center " + classes.multipleInputsMasked
          }
        >
          {children}
          <input
            {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
            ref={inputRef}
            className="outline-none border-none bg-transparent relative left-11 lg:left-8 my-8 lg:pl-6 h-16 font-mono text-base"
            required={required}
          />
        </div>
      ) : (
        <input
          {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
          ref={inputRef}
          className="bg-background border border-gray-dark rounded h-16 pl-6 w-full mt-4 mb-8 relative placeholder-gray-dark text-m"
          required={required}
        />
      )}
    </label>
  );
};

export { InputText };
