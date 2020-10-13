import React from "react";
import styled from "styled-components";

import { Arrow } from "../Arrow/Arrow";
import { BurgerIcon } from "../BurgerIcon/BurgerIcon";
import { NavBarCrossIcon } from "../NavBarCrossIcon/NavBarCrossIcon";

export const MobileNavigationBar: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Bar>
      <MenuItem>
        <Arrow />
        Back
      </MenuItem>

      <SecondItem onClick={() => setOpen(!open)}>
        {open ? (
          <>
            <div>Close</div>
            <NavBarCrossIcon />
          </>
        ) : (
          <>
            <div>Menu</div>
            <BurgerIcon />
          </>
        )}
      </SecondItem>
    </Bar>
  );
};

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 7.2rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.box};
  display: flex;
  border-top: 0.1rem solid ${({ theme }) => theme.colors.separator};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spaces.xs};
`;

const SecondItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  border-left: 0.1rem solid ${({ theme }) => theme.colors.separator};
`;
