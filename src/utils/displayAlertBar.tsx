import React, { ReactElement } from "react";

import { AlertBar } from "@src/components/display/fewlines/AlertBar/AlertBar";

export function displayAlertBar(text: string | undefined): ReactElement {
  return <AlertBar text={text} />;
}
