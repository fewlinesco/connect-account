import { useRouter } from "next/router";
import React from "react";

import { ButtonVariant } from "../buttons/buttons";
import { NeutralLink } from "../neutral-link/neutral-link";
import { FakeButton } from "@src/components/buttons/fake-button";
import { formatNavigation } from "@src/configs/intl";

const LogoutAnchor: React.FC = () => {
  const { locale } = useRouter();

  return (
    <NeutralLink href="/api/logout/">
      <FakeButton variant={ButtonVariant.LIGHT_GREY}>
        {formatNavigation(locale || "en", "logout")}
      </FakeButton>
    </NeutralLink>
  );
};

export { LogoutAnchor };
