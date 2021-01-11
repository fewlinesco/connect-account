import React from "react";
import styled from "styled-components";

import { HomeIcon } from "../display/fewlines/Icons/HomeIcon/HomeIcon";
import { KeyIcon } from "../display/fewlines/Icons/KeyIcon/KeyIcon";
import { LockIcon } from "../display/fewlines/Icons/LockIcon/LockIcon";
import { BlackSwitchIcon } from "../display/fewlines/Icons/SwitchIcon/BlackSwitchIcon/BlackSwitchIcon";
import { BlackWorldIcon } from "../display/fewlines/Icons/WorldIcon/BlackWorldIcon/BlackWorldIcon";
import { Header } from "../header/header";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";

export const DesktopNavigationBar: React.FC = () => {
  return (
    <Bar>
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
    </Bar>
  );
};

const Bar = styled.div`
  width: 100%;
`;

const ListItem = styled(NeutralLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs} 0 ${({ theme }) => theme.spaces.xs}
    ${({ theme }) => theme.spaces.xs};
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
