import React from "react";
import styled from "styled-components";

import { Header } from "../Header/Header";
import { HomeIcon } from "../Icons/HomeIcon/HomeIcon";
import { KeyIcon } from "../Icons/KeyIcon/KeyIcon";
import { LockIcon } from "../Icons/LockIcon/LockIcon";
import { BlackSwitchIcon } from "../Icons/SwitchIcon/BlackSwitchIcon/BlackSwitchIcon";
import { BlackWorldIcon } from "../Icons/WorldIcon/BlackWorldIcon/BlackWorldIcon";
import { NeutralLink } from "../NeutralLink";
import { Separator } from "../Separator/Separator";

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
