import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

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
          <ListItem href={href} key={title + href}>
            {icon}
            <p>{formatNavigation(locale || "en", title)}</p>
          </ListItem>
        );
      })}
      <Separator />
      <SwitchLanguageItem href="/account/locale/">
        <SwitchLanguageLabel>
          <BlackWorldIcon />
          <p>{formatNavigation(locale || "en", "language")}</p>
          <BlackSwitchIcon />
        </SwitchLanguageLabel>
      </SwitchLanguageItem>
      <LogoutAnchor />
    </>
  );
};

const ListItem = styled(NeutralLink)`
  display: flex;
  align-items: center;
  padding-top: 1.75rem;
  padding-bottom: 1.75rem;
  padding-right: 0;
  padding-left: ${({ theme }) => theme.spaces.xs};

  p {
    margin: 0 0 0 1.5rem;
  }
`;

const SwitchLanguageItem = styled(NeutralLink)`
  display: flex;
  justify-content: space-between;
  padding: 2.5rem 2rem;
`;

const SwitchLanguageLabel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    flex-grow: 2.7;
    margin-left: 3rem;
  }
`;

export { DesktopNavigationBar };
