import React from "react";
import styled from "styled-components";

import { CloseConfirmationBoxButton } from "../buttons/buttons";
import { ClickAwayListener } from "../click-away-listener";
import { deviceBreakpoints } from "@src/design-system/theme";

interface ConfirmationBoxProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preventAnimation: boolean;
}

const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  open,
  setOpen,
  preventAnimation,
  children,
}) => {
  React.useEffect(() => {
    const escapePressed = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keyup", escapePressed);
    return () => window.removeEventListener("keyup", escapePressed);
  });

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
        <CloseConfirmationBoxButton onPress={() => setOpen(false)} />
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
  border-radius: ${({ theme }) => theme.radii[0]};
  z-index: 3;

  @media ${deviceBreakpoints.m} {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    transform: none;
    padding: 4rem 4rem 2rem;
    border-radius: 0;
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spaces.xs};
    line-height: ${({ theme }) => theme.lineHeights.copy};
    text-align: center;
    word-break: break-word;
  }

  .cross {
    position: absolute;
    top: ${({ theme }) => theme.spaces.xs};
    right: ${({ theme }) => theme.spaces.xs};
    cursor: pointer;
  }

  ${({ open }) =>
    open &&
    `
    visibility: visible;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
  `}

  ${({ open }) => !open && `visibility: hidden;`};
`;

export { ConfirmationBox };
