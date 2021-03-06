import React from "react";

import { PrimaryBadge } from "./badges";

const StandardPrimaryBadge = (): JSX.Element => {
  return <PrimaryBadge localizedLabel="Primary" />;
};

export { StandardPrimaryBadge };
export default { title: "components/Primary Badge", component: PrimaryBadge };
