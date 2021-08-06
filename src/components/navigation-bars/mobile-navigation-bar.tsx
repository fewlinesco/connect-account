import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { ClickAwayListener } from "../click-away-listener";
import { Arrow } from "../icons/arrow/arrow";
import { BurgerIcon } from "../icons/burger-icon/burger-icon";
import { NavBarCrossIcon } from "../icons/navbar-cross-icon/navbar-cross-icon";
import { RightChevron } from "../icons/right-chevron/right-chevron";
import { WhiteSwitchIcon } from "../icons/switch-icon/white-switch-icon/white-switch-icon";
import { WhiteWorldIcon } from "../icons/world-icon/white-world-icon/white-world-icon";
import { LogoutAnchor } from "../logout-anchor/logout-anchor";
import { NeutralLink } from "../neutral-link/neutral-link";
import { SkeletonTextLine } from "../skeletons/skeletons";
import { getNavigationSections } from "./navigation-sections";
import { Profile } from "@src/@types/profile";
import { formatNavigation } from "@src/configs/intl";
import { deviceBreakpoints } from "@src/design-system/theme";
import { SWRError } from "@src/errors/errors";
import { navigationFetcher } from "@src/queries/swr-navigation-fetcher";

const MobileNavigationBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const { data: userProfile, isValidating } = useSWR<Profile, SWRError>(
    `/api/profile/user-profile/`,
    navigationFetcher,
  );

  return (
    <>
      {isOpen ? <ClickAwayListener onClick={() => setIsOpen(false)} /> : null}
      <Container>
        {isOpen ? (
          <MenuList>
            {getNavigationSections(userProfile ? false : true).map(
              ([title, { href, icon }], index) => {
                if (index === 1 && isValidating) {
                  return (
                    <ListItem href="#" key={title + href}>
                      <ListItemLabel>
                        {icon}
                        <SizedDiv>
                          <SkeletonTextLine fontSize={1.6} width={100} />
                        </SizedDiv>
                      </ListItemLabel>
                      <RightChevron />
                    </ListItem>
                  );
                }

                return (
                  <ListItem
                    href={href}
                    onClick={() => setIsOpen(false)}
                    key={title + href}
                  >
                    <ListItemLabel>
                      {icon}
                      <p>{formatNavigation(router.locale || "en", title)}</p>
                    </ListItemLabel>
                    <RightChevron />
                  </ListItem>
                );
              },
            )}
            <LogoutAnchor />
          </MenuList>
        ) : null}
        <SubSection>
          {isOpen ? (
            <MenuItem color="primary" onClick={() => setIsOpen(false)}>
              <SpecialLink href="/account/locale/">
                <Content>
                  <LanguagesOptions>
                    <WhiteWorldIcon />
                    <div>
                      {formatNavigation(router.locale || "en", "language")}
                    </div>
                  </LanguagesOptions>
                  <WhiteSwitchIcon />
                </Content>
              </SpecialLink>
            </MenuItem>
          ) : (
            <MenuItem onClick={() => router.back()}>
              <Content>
                <Arrow />
                <div>{formatNavigation(router.locale || "en", "back")}</div>
              </Content>
            </MenuItem>
          )}
          <MenuItem borderLeft={true} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <Content>
                <div>{formatNavigation(router.locale || "en", "close")}</div>
                <NavBarCrossIcon />
              </Content>
            ) : (
              <Content>
                <div>{formatNavigation(router.locale || "en", "menu")}</div>
                <BurgerIcon />
              </Content>
            )}
          </MenuItem>
        </SubSection>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  display: none;

  @media ${deviceBreakpoints.m} {
    display: block;
  }
`;

const SubSection = styled.div`
  height: 7.2rem;
  display: flex;
  border-top: 0.1rem solid ${({ theme }) => theme.colors.separator};
`;

const MenuItem = styled.div<{
  color?: string;
  borderLeft?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.box};

  ${({ color, theme }) =>
    color === "primary" &&
    `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.background}
  `};

  ${({ borderLeft, theme }) =>
    borderLeft &&
    `
    border-left: 0.1rem solid ${theme.colors.separator};
  `};
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 ${({ theme }) => theme.spaces.xs};
`;

const LanguagesOptions = styled.div`
  display: flex;
  align-items: center;

  div {
    margin: 0 0 0 ${({ theme }) => theme.spaces.xxs};
  }
`;

const MenuList = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
`;

const ListItem = styled(NeutralLink)`
  height: 7.2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spaces.xs};

  p {
    margin: 0 0 0 1.5rem;
  }
`;

const ListItemLabel = styled.div`
  display: flex;
  align-items: center;
`;

const SpecialLink = styled(NeutralLink)`
  & div {
    color: ${({ theme }) => theme.colors.background};
  }
`;

const SizedDiv = styled.div`
  width: 7rem;
  margin: 0 0 0 1.5rem;
`;

export { MobileNavigationBar };
