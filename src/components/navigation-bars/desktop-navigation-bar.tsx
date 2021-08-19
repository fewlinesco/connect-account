import { useRouter } from "next/router";
import React from "react";

import { Header } from "../header";
import { BlackSwitchIcon } from "../icons/switch-icon/black-switch-icon";
import { BlackWorldIcon } from "../icons/world-icon/black-world-icon";
import { LogoutAnchor } from "../logout-anchor";
import { NeutralLink } from "../neutral-link";
import { Separator } from "../separator";
import { getNavigationSections } from "./navigation-sections";
import { formatNavigation } from "@src/configs/intl";

const DesktopNavigationBar: React.FC = () => {
  const { locale } = useRouter();

  return (
    <>
      <Header viewport="desktop" />
      {getNavigationSections().map(([title, { href, icon }]) => {
        return (
          <NeutralLink
            className="flex items-center py-7 pl-8"
            href={href}
            key={title + href}
          >
            {icon}
            <p className="ml-6">{formatNavigation(locale || "en", title)}</p>
          </NeutralLink>
        );
      })}
      <Separator />
      <NeutralLink
        className="flex items-center justify-between py-9 px-10"
        href="/account/locale/"
      >
        <BlackWorldIcon />
        <p className="flex-grow ml-10">
          {formatNavigation(locale || "en", "language")}
        </p>
        <BlackSwitchIcon />
      </NeutralLink>
      <LogoutAnchor />
    </>
  );
};

export { DesktopNavigationBar };
