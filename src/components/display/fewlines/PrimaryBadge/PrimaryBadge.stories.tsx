import React from "react";

import { PrimaryIcon } from "../PrimaryIcon/PrimaryIcon";
import { PrimaryBadge } from "./PrimaryBadge";

export default { title: "PrimaryBadge", component: PrimaryBadge };

export const StandardPrimaryBadge = (): JSX.Element => {
  return (
    <PrimaryBadge>
      <p>Primary</p>
      <PrimaryIcon />
    </PrimaryBadge>
  );
};
