import React from "react";

import { NeutralLink } from "./neutral-link";

export default {
  title: "components/Neutral Link",
  component: NeutralLink,
};

export const BasicNeutralLink = (): JSX.Element => {
  return <NeutralLink href="/">Homepage</NeutralLink>;
};
