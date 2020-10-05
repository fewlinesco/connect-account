import React from "react";

import { AwaitingValidationBadge } from "./AwaitingValidationBadge";

export default {
  title: "components/AwaitingValidationBadge",
  component: AwaitingValidationBadge,
};

export const StandardAwaitingValidationBadge = (): JSX.Element => {
  return <AwaitingValidationBadge />;
};
