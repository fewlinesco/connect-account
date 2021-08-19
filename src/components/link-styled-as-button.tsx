import React from "react";

import { getButtonStyle, ButtonVariant } from "./buttons";

const LinkStyledAsButton: React.FC<{
  variant: ButtonVariant;
  className?: string;
}> = ({ variant, className, children }) => {
  return (
    <div
      className={`${getButtonStyle(
        variant,
      )} flex items-center justify-center + ${className}`}
    >
      {children}
    </div>
  );
};

export { LinkStyledAsButton };
