import React from "react";

import classes from "./input-switch.module.css";

const InputSwitch: React.FC<{
  groupName: string;
  labelText: string;
  isSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ groupName, labelText, isSelected, onChange, className }) => {
  return (
    <label
      className={`relative flex items-center justify-between w-full cursor-pointer ${
        className ? className : ""
      } ${classes.inputSwitch}`}
      htmlFor={labelText}
    >
      {labelText}
      <input
        className="sr-only"
        type="checkbox"
        id={labelText}
        name={groupName}
        onChange={onChange}
        value={labelText}
        checked={isSelected}
      />
      <span className="relative w-14 h-8 lg:h-7 bg-gray-light rounded-full" />
    </label>
  );
};

export { InputSwitch };
