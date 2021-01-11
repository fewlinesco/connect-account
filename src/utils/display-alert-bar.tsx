import React, { ReactElement } from "react";

import { AlertBar } from "@src/components/alert-bar/alert-bar";

export function displayAlertBar(text: string): ReactElement {
  return <AlertBar text={text} />;
}
