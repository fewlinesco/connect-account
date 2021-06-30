import React from "react";

import { AwaitingValidationBadge } from "./badges";

const StandardAwaitingValidationBadge = (): JSX.Element => {
  return <AwaitingValidationBadge label="Awaiting validation" />;
};

export { StandardAwaitingValidationBadge };
export default {
  title: "components/Awaiting Validation Badge",
  component: AwaitingValidationBadge,
};
