import React from "react";
import styled from "styled-components";

import { ClickAwayListener } from "../ClickAwayListener";
import { deviceBreakpoints } from "@src/design-system/theme";

interface ConfirmationBoxProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preventAnimation: boolean;
  children: JSX.Element;
}

export const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  open,
  setOpen,
  preventAnimation,
  children,
}) => {
  return (
    <>
      {open && (
        <ClickAwayListener
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      <Box open={open} preventAnimation={preventAnimation}>
        {children}
      </Box>
    </>
  );
};

const Box = styled.div<Pick<ConfirmationBoxProps, "open" | "preventAnimation">>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem 3rem;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 3;

  @media ${deviceBreakpoints.m} {
    position: fixed;
    left: 0;
    bottom: 0;
  }

  ${(props) =>
    props.open &&
    `
    animation: appearFromBottom 0.1s;
    visibility: visible;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
  `}

  ${(props) =>
    !props.open &&
    `
    animation: disappearFromBottom 0.1s;
    visibility: hidden;
  `};

  ${(props) =>
    props.preventAnimation &&
    `
    animation: none;
  `};

  @keyframes appearFromBottom {
    from {
      bottom: -250px;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0);
    }
    to {
      bottom: 0;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
    }
  }

  @keyframes disappearFromBottom {
    from {
      bottom: 0;
      visibility: visible;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
    }
    to {
      bottom: -250px;
      visibility: hidden;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0);
    }
  }
`;
