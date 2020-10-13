import React from "react";
import styled from "styled-components";

import { Arrow } from "../Arrow/Arrow";
import { BurgerIcon } from "../BurgerIcon/BurgerIcon";
import { NavBarCrossIcon } from "../NavBarCrossIcon/NavBarCrossIcon";

interface MenuItemProps {
  color?: string;
  borderLeft?: boolean;
}

export const MobileNavigationBar: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <Bar>
        {open ? (
          <MenuItem color="primary">
            <Content>
              <div>English</div>
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
    </>
  );
};

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 7.2rem;
  width: 100%;
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
