import React from "react";
import styled from "styled-components";

import { BlackSwitchIcon } from "../BlackSwitchIcon/BlackSwitchIcon";
import { BlackWorldIcon } from "../BlackWorldIcon/BlackWorldIcon";
import { HomeIcon } from "../HomeIcon/HomeIcon";
import { KeyIcon } from "../KeyIcon/KeyIcon";
import { LockIcon } from "../LockIcon/LockIcon";
import { Separator } from "../Separator/Separator";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export const DesktopNavigationBar: React.FC = () => {
  return (
    <Bar>
      <ListItem>
        <HomeIcon />
        <div>Home</div>
      </ListItem>
      <ListItem>
        <KeyIcon />
        <div>Logins</div>
      </ListItem>
      <ListItem>
        <LockIcon />
        <div>Security</div>
      </ListItem>
      <Separator />
      <SwitchLanguageItem>
        <SwitchLanguageLabel>
          <BlackWorldIcon />
          <div>English</div>
        </SwitchLanguageLabel>
        <BlackSwitchIcon />
      </SwitchLanguageItem>
    </Bar>
  );
};

const Bar = styled.div`
  max-width: 30%;

  @media ${deviceBreakpoints.m} {
    display: none;
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs} 0 ${({ theme }) => theme.spaces.xs}
    ${({ theme }) => theme.spaces.xs};

  div {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;

const SwitchLanguageItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spaces.xs};
`;

const SwitchLanguageLabel = styled.div`
  display: flex;
  align-items: center;

  div {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;
