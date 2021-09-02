import React from "react";

import classes from "./input-switch.module.css";

const InputSwitch: React.FC<{
  groupName: string;
  labelText: string;
  isSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ groupName, labelText, isSelected, onChange }) => {
  return (
    <label
      className={`relative flex items-center justify-between w-full cursor-pointer ${classes.inputSwitch}`}
      htmlFor={labelText}
    >
      <p>{labelText}</p>
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
