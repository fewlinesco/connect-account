import React from "react";
import styled from "styled-components";

import { Header } from "../header/header";
import { BlackSwitchIcon } from "../icons/switch-icon/black-switch-icon/black-switch-icon";
import { BlackWorldIcon } from "../icons/world-icon/black-world-icon/black-world-icon";
import { LogoutAnchor } from "../logout-anchor/logout-anchor";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";
import { NAVIGATION_SECTIONS } from "./navigation-sections";

const DesktopNavigationBar: React.FC = () => {
  return (
    <>
      <Header />
      {Object.entries(NAVIGATION_SECTIONS).map(([title, { href, icon }]) => {
        return (
          <ListItem href={href} key={title + href}>
            {icon}
            <p>{title}</p>
          </ListItem>
        );
      })}
      <Separator />
      <SwitchLanguageItem href="/account/locale">
        <SwitchLanguageLabel>
          <BlackWorldIcon />
          <p>English</p>
        </SwitchLanguageLabel>
        <BlackSwitchIcon />
      </SwitchLanguageItem>
      <LogoutAnchor />
    </>
  );
};

const ListItem = styled(NeutralLink)`
  display: flex;
  align-items: center;
  padding-top: ${({ theme }) => theme.spaces.xs};
  padding-bottom: ${({ theme }) => theme.spaces.xs};
  padding-right: 0;
  padding-left: ${({ theme }) => theme.spaces.xs};

  p {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;

const SwitchLanguageItem = styled(NeutralLink)`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spaces.xs};
`;

const SwitchLanguageLabel = styled.div`
  display: flex;
  align-items: center;

  p {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;

export { DesktopNavigationBar };
