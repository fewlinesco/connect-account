import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ClickAwayListener } from "../click-away-listener";
import { Arrow } from "../icons/arrow/arrow";
import { BurgerIcon } from "../icons/burger-icon/burger-icon";
import { NavBarCrossIcon } from "../icons/navbar-cross-icon/navbar-cross-icon";
import { RightChevron } from "../icons/right-chevron/right-chevron";
import { WhiteSwitchIcon } from "../icons/switch-icon/white-switch-icon/white-switch-icon";
import { WhiteWorldIcon } from "../icons/world-icon/white-world-icon/white-world-icon";
import { LogoutAnchor } from "../logout-anchor/logout-anchor";
import { NeutralLink } from "../neutral-link/neutral-link";
import { NAVIGATION_SECTIONS } from "./navigation-sections";
import { deviceBreakpoints } from "@src/design-system/theme";

const MobileNavigationBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      {isOpen ? <ClickAwayListener onClick={() => setIsOpen(false)} /> : null}
      <Container>
        {isOpen ? (
          <MenuList>
            {Object.entries(NAVIGATION_SECTIONS).map(
              ([title, { href, icon }]) => {
                return (
                  <ListItem
                    href={href}
                    onClick={() => setIsOpen(false)}
                    key={title + href}
                  >
                    <ListItemLabel>
                      {icon}
                      <p>{title.replace("_", " ")}</p>
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
              <SpecialLink href="/account/locale">
                <Content>
                  <LanguagesOptions>
                    <WhiteWorldIcon />
                    <div>English</div>
                  </LanguagesOptions>
                  <WhiteSwitchIcon />
                </Content>
              </SpecialLink>
            </MenuItem>
          ) : (
            <MenuItem onClick={() => router.back()}>
              <Content>
                <Arrow />
                <div>Back</div>
              </Content>
            </MenuItem>
          )}
          <MenuItem borderLeft={true} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <Content>
                <div>Close</div>
                <NavBarCrossIcon />
              </Content>
            ) : (
              <Content>
                <div>Menu</div>
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

  ${(props) =>
    props.color === "primary" &&
    `
    background-color: ${props.theme.colors.primary};
    color: ${props.theme.colors.background}
  `};

  ${(props) =>
    props.borderLeft &&
    `
    border-left: 0.1rem solid ${props.theme.colors.separator};
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

export { MobileNavigationBar };
