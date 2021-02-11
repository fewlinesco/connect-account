import React from "react";

import { NeutralLink } from "./neutral-link";

const BasicNeutralLink = (): JSX.Element => {
  return <NeutralLink href="/">Homepage</NeutralLink>;
};

export { BasicNeutralLink };
export default {
  title: "components/Neutral Link",
  component: NeutralLink,
};
