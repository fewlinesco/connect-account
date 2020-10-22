import React from "react";

import { AwaitingValidationBadge } from "./AwaitingValidationBadge";

export default {
  title: "components/Awaiting Validation Badge",
  component: AwaitingValidationBadge,
};

export const StandardAwaitingValidationBadge = (): JSX.Element => {
  return <AwaitingValidationBadge />;
};
