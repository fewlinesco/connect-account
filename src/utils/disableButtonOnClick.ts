import React, { ButtonHTMLAttributes } from "react";

export function disableButtonOnClick(
  buttonRef: React.MutableRefObject<ButtonHTMLAttributes>,
): void {
  if (buttonRef && buttonRef.current) {
    buttonRef.current.setAttribute("disabled", "disabled");
  }
}
