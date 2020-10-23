import React from "react";
import styled from "styled-components";

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
  position: fixed;
  left: 0;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;

  ${(props) =>
    props.open &&
    `
    animation: appearFromBottom 0.1s;
    bottom: 0;
    visibility: visible;
    z-index: 3;
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
