import React from "react";

import { AwaitingValidationIcon } from "../AwaitingValidationIcon/AwaitingValidationIcon";
import { AwaitingValidationBadge } from "./AwaitingValidationBadge";

export default {
  title: "AwaitingValidationBadge",
  component: AwaitingValidationBadge,
};

export const StandardAwaitingValidationBadge = (): JSX.Element => {
  return (
    <AwaitingValidationBadge>
      <p>AwaitingValidation</p>
      <AwaitingValidationIcon />
    </AwaitingValidationBadge>
  );
};
