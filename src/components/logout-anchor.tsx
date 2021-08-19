import { useRouter } from "next/router";
import React from "react";

import { ButtonVariant } from "./buttons";
import { NeutralLink } from "./neutral-link";
import { LinkStyledAsButton } from "@src/components/link-styled-as-button";
import { formatNavigation } from "@src/configs/intl";

const LogoutAnchor: React.FC = () => {
  const { locale } = useRouter();

  return (
    <NeutralLink href="/api/logout/">
      <LinkStyledAsButton variant={ButtonVariant.LIGHT_GREY}>
        {formatNavigation(locale || "en", "logout")}
      </LinkStyledAsButton>
    </NeutralLink>
  );
};

export { LogoutAnchor };
