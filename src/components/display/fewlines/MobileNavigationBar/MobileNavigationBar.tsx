import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import { Arrow } from "../Arrow/Arrow";
import { BurgerIcon } from "../BurgerIcon/BurgerIcon";
import { NavBarCrossIcon } from "../NavBarCrossIcon/NavBarCrossIcon";
import RightChevron from "../RightChevron/RightChevron";
import { SwitchIcon } from "../SwitchIcon/SwitchIcon";
import { WorldIcon } from "../WorldIcon/WorldIcon";

interface MenuItemProps {
  color?: string;
  borderLeft?: boolean;
}

type MobileNavigationBarProp = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const MobileNavigationBar: React.FC<MobileNavigationBarProp> = ({
  open,
  setOpen,
}) => {
  return (
    <Container>
      {open && (
        <>
          <MenuList>
            <ListItem>
              <div>Logins</div>
              <RightChevron />
            </ListItem>
          </MenuList>
        </>
      )}
      <Bar>
        {open ? (
          <MenuItem color="primary">
            <Content>
              <LanguagesOptions>
                <WorldIcon />
                <div>English</div>
              </LanguagesOptions>
              <SwitchIcon />
            </Content>
          </MenuItem>
        ) : (
          <MenuItem>
            <Content>
              <Arrow />
              <div>Back</div>
            </Content>
          </MenuItem>
        )}

        <MenuItem borderLeft={true} onClick={() => setOpen(!open)}>
          {open ? (
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
      </Bar>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 2;
`;

const Bar = styled.div`
  height: 7.2rem;
  display: flex;
  border-top: 0.1rem solid ${({ theme }) => theme.colors.separator};
`;

const MenuItem = styled.div<MenuItemProps>`
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
  z-index: 2;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
  background-color: ${({ theme }) => theme.colors.background};
`;

const ListItem = styled.div`
  height: 7.2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spaces.xs};
`;
