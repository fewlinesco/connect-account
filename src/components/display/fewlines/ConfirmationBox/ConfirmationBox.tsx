import styled from "styled-components";

interface ConfirmationBoxProps {
  open: boolean;
}

export const ConfirmationBox = styled.div<ConfirmationBoxProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem 3rem;
  position: fixed;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  left: 0;
  ${(props) =>
    props.open &&
    `
    animation: appearFromBottom 0.1s;
    bottom: 0;
    visibility: visible;
    z-index: 2;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.3);
  `}

  ${(props) =>
    !props.open &&
    `
    animation: disappearFromBottom 0.1s;
    visibility: hidden;
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
