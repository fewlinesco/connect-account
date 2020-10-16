import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { BlackSwitchIcon } from "../BlackSwitchIcon/BlackSwitchIcon";
import { BlackWorldIcon } from "../BlackWorldIcon/BlackWorldIcon";
import { Header } from "../Header/Header";
import { HomeIcon } from "../HomeIcon/HomeIcon";
import { KeyIcon } from "../KeyIcon/KeyIcon";
import { LockIcon } from "../LockIcon/LockIcon";
import { Separator } from "../Separator/Separator";

export const DesktopNavigationBar: React.FC = () => {
  const router = useRouter();

  return (
    <Bar>
      <Header />
      <ListItem onClick={() => router.push("/account")}>
        <HomeIcon />
        <div>Home</div>
      </ListItem>
      <ListItem>
        <KeyIcon />
        <div onClick={() => router.push("/account/logins")}>Logins</div>
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
  width: 100%;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs} 0 ${({ theme }) => theme.spaces.xs}
    ${({ theme }) => theme.spaces.xs};
  cursor: pointer;

  div {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;

const SwitchLanguageItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
`;

const SwitchLanguageLabel = styled.div`
  display: flex;
  align-items: center;

  div {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xs};
  }
`;
