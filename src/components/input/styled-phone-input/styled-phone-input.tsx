import React from "react";
import PhoneInput, { PhoneInputProps } from "react-phone-number-input";

import classes from "./styled-phone-input.module.css";

const StyledPhoneInput: React.FC<PhoneInputProps> = (props) => {
  return (
    <PhoneInput
      className={`my-8 placeholder-gray-dark ${classes.styledPhoneInput}`}
      {...props}
    />
  );
};

export { StyledPhoneInput };
