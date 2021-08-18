import React from "react";

import { Logo } from "./logo";
import { NeutralLink } from "./neutral-link";

const Header: React.FC<{ viewport: "desktop" | "mobile" }> = ({ viewport }) => {
  return (
    <div className="flex items-center m-8">
      <NeutralLink href="/account/">
        <Logo viewport={viewport} />
      </NeutralLink>
      <p className="flex items-center h-16 font-normal text-2xl pl-4 ml-4 border-l border-gray">
        Account
      </p>
    </div>
  );
};

export { Header };
