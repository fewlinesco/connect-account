import React, { ReactElement } from "react";

import { AlertBar } from "@src/components/display/fewlines/AlertBar";

export function displayAlertBar(text: string): ReactElement {
  return <AlertBar text={text} />;
}
