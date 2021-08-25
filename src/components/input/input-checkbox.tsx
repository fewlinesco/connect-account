import React from "react";

type CheckboxProps = {
  name: string;
  onChange: () => void;
  label: string;
};

const InputCheckbox: React.FC<CheckboxProps> = (props) => {
  const { label, name, onChange } = props;

  return (
    <label className="flex items-center cursor-pointer mb-8">
      <input
        className="w-6 h-6 mr-4 cursor-pointer"
        type="checkbox"
        name={name}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export { InputCheckbox };
