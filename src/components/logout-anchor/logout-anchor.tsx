import React from "react";

import { ButtonVariant } from "../buttons/buttons";
import { NeutralLink } from "../neutral-link/neutral-link";
import { FakeButton } from "@src/components/buttons/fake-button";

const LogoutAnchor: React.FC = () => {
  return (
    <NeutralLink href="/api/logout">
      <FakeButton variant={ButtonVariant.GREY}>Logout</FakeButton>
    </NeutralLink>
  );
};

export { LogoutAnchor };
