import React from "react";

import { getButtonStyle, ButtonVariant } from "./buttons/buttons";

const LinkStyledAsButton: React.FC<{ variant: ButtonVariant }> = ({
  variant,
  children,
}) => {
  return <div className={getButtonStyle(variant)}>{children}</div>;
};

export { LinkStyledAsButton };
