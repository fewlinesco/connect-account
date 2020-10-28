import React from "react";
import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

interface ConfirmationBoxProps {
  open: boolean;
  preventAnimation: boolean;
  children: JSX.Element;
}

export const ConfirmationBox: React.FC<ConfirmationBoxProps> = ({
  open,
  preventAnimation,
  children,
}) => {
  return (
    <Box open={open} preventAnimation={preventAnimation}>
      {children}
    </Box>
  );
};

const Box = styled.div<ConfirmationBoxProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem 3rem;
  position: sticky;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background};
  width: 52.8rem;

  @media ${deviceBreakpoints.m} {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  ${(props) =>
    props.open &&
    `
    animation: appearFromBottom 0.1s;
    visibility: visible;
    z-index: 3;
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
    }
    to {
      bottom: 0;
    }
  }

  @keyframes disappearFromBottom {
    from {
      bottom: 0;
      visibility: visible;
    }
    to {
      bottom: -250px;
      visibility: hidden;
    }
  }
`;
