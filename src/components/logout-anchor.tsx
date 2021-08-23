import { useRouter } from "next/router";
import React from "react";

import { NeutralLink } from "./neutral-link";
import { formatNavigation } from "@src/configs/intl";

const LogoutAnchor: React.FC = () => {
  const { locale } = useRouter();

  return (
    <NeutralLink href="/api/logout/">
      <div className="btn btn-light-grey btn-neutral-link">
        {formatNavigation(locale || "en", "logout")}
      </div>
    </NeutralLink>
  );
};

export { LogoutAnchor };
