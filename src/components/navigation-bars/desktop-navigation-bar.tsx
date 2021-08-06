import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { Header } from "../header/header";
import { BlackSwitchIcon } from "../icons/switch-icon/black-switch-icon/black-switch-icon";
import { BlackWorldIcon } from "../icons/world-icon/black-world-icon/black-world-icon";
import { LogoutAnchor } from "../logout-anchor/logout-anchor";
import { NeutralLink } from "../neutral-link/neutral-link";
import { Separator } from "../separator/separator";
import { SkeletonTextLine } from "../skeletons/skeletons";
import { getNavigationSections } from "./navigation-sections";
import { Profile } from "@src/@types/profile";
import { formatNavigation } from "@src/configs/intl";
import { SWRError } from "@src/errors/errors";
import { navigationFetcher } from "@src/queries/swr-navigation-fetcher";

const DesktopNavigationBar: React.FC = () => {
  const { locale } = useRouter();

  const { data: userProfile, isValidating } = useSWR<Profile, SWRError>(
    `/api/profile/user-profile/`,
    navigationFetcher,
  );

  return (
    <>
      <Header />
      {getNavigationSections(userProfile ? false : true).map(
        ([title, { href, icon }], index) => {
          if (index === 1 && isValidating) {
            return (
              <ListItem href="#" key={title + href}>
                {icon}
                <SkeletonTextLine fontSize={1.6} width={50} />
              </ListItem>
            );
          }

          return (
            <ListItem href={href} key={title + href}>
              {icon}
              <p>{formatNavigation(locale || "en", title)}</p>
            </ListItem>
          );
        },
      )}
      <Separator />
      <SwitchLanguageItem href="/account/locale/">
        <SwitchLanguageLabel>
          <BlackWorldIcon />
          <p>{formatNavigation(locale || "en", "language")}</p>
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

  p,
  div {
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
