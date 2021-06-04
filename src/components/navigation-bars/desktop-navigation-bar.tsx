import { HttpStatus } from "@fwl/web";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { Header } from "../header/header";
import { BlackSwitchIcon } from "../icons/switch-icon/black-switch-icon/black-switch-icon";
import { BlackWorldIcon } from "../icons/world-icon/black-world-icon/black-world-icon";
import { LogoutAnchor } from "../logout-anchor/logout-anchor";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";
import { getNavigationSections } from "./navigation-sections";
import { Profile } from "@src/@types/profile";
import { configVariables } from "@src/configs/config-variables";
import { SWRError } from "@src/errors/errors";

const DesktopNavigationBar: React.FC = () => {
  const { data: userProfile } = useSWR<Profile, SWRError>(
    `/api/profile/user-profile`,
    async (url) => {
      return await fetch(url).then(async (response) => {
        if (!response.ok) {
          const error = new SWRError(
            "An error occurred while fetching the data. FLAG",
          );

          if (response.status === HttpStatus.NOT_FOUND) {
            error.info = await response.json();
            error.statusCode = response.status;
            return;
          }

          error.info = await response.json();
          error.statusCode = response.status;
          throw error;
        }

        return response.json();
      });
    },
  );

  return (
    <>
      <Header />
      {getNavigationSections(userProfile ? false : true).map(
        ([title, { href, icon }]) => {
          if (
            (!configVariables.featureFlag && href === "/account/profile") ||
            (!configVariables.featureFlag &&
              href === "/account/profile/user-profile/new")
          ) {
            return <React.Fragment key={title + href} />;
          }

          return (
            <ListItem href={href} key={title + href}>
              {icon}
              <p>{title.replace(/_/g, " ")}</p>
            </ListItem>
          );
        },
      )}
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
