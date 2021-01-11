import React from "react";

import { AwaitingValidationBadge } from "./awaiting-validation-badge";

export default {
  title: "components/Awaiting Validation Badge",
  component: AwaitingValidationBadge,
};

export const StandardAwaitingValidationBadge = (): JSX.Element => {
  return <AwaitingValidationBadge />;
};
