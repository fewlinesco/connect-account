import React from "react";
import styled from "styled-components";

import { Header } from "../header/header";
import { HomeIcon } from "../icons/home-icon/home-icon";
import { KeyIcon } from "../icons/key-icon/key-icon";
import { LockIcon } from "../icons/lock-icon/lock-icon";
import { BlackSwitchIcon } from "../icons/switch-icon/black-switch-icon/black-switch-icon";
import { BlackWorldIcon } from "../icons/world-icon/black-world-icon/black-world-icon";
import { LogoutAnchor } from "../logout-anchor/logout-anchor";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";

export const DesktopNavigationBar: React.FC = () => {
  return (
    <>
      <Header />
      <ListItem href="/account">
        <HomeIcon />
        <ListLabel>Home</ListLabel>
      </ListItem>
      <ListItem href="/account/logins">
        <KeyIcon />
        <ListLabel>Logins</ListLabel>
      </ListItem>
      <ListItem href="/account/security">
        <LockIcon />
        <ListLabel>Security</ListLabel>
      </ListItem>
      <Separator />
      <SwitchLanguageItem href="/account/locale">
        <SwitchLanguageLabel>
          <BlackWorldIcon />
          <ListLabel>English</ListLabel>
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
`;

const ListLabel = styled.p`
  margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
`;

const SwitchLanguageItem = styled(NeutralLink)`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spaces.xs};
`;

const SwitchLanguageLabel = styled.div`
  display: flex;
  align-items: center;
`;
