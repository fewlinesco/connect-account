import React from "react";
import styled from "styled-components";

import { ClickAwayListener } from "../click-away-listener";
import { CrossIcon } from "../icons/cross-icon/cross-icon";
import { deviceBreakpoints } from "@src/design-system/theme";

interface ConfirmationBoxProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preventAnimation: boolean;
  children: JSX.Element;
}

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
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
          data-testid="clickAwayListener"
        />
      )}
      <Box open={open} preventAnimation={preventAnimation}>
        <div className="cross" onClick={() => setOpen(false)}>
          <CrossIcon />
        </div>
        {children}
      </Box>
    </>
  );
};

const Box = styled.div<Pick<ConfirmationBoxProps, "open" | "preventAnimation">>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4.8rem;
  width: calc(88rem * 60 / 100);
  background-color: ${({ theme }) => theme.colors.background};
  position: absolute;
  bottom: 50%;
  right: 50%;
  transform: translate(50%, 50%);
  z-index: 3;

  @media ${deviceBreakpoints.m} {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    transform: none;
    padding: 4rem 4rem 2rem;
  }

  .cross {
    position: absolute;
    top: ${({ theme }) => theme.spaces.xs};
    right: ${({ theme }) => theme.spaces.xs};
    cursor: pointer;
  }

  ${(props) =>
    props.open &&
    `
    visibility: visible;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
  `}

  ${(props) =>
    !props.open &&
    `
    visibility: hidden;
  `};
`;

export { ConfirmationBox };
