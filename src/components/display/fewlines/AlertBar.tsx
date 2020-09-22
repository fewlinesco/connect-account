import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../../../@types/Identity";

export const AlertBar: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  if (type.toUpperCase() === IdentityTypes.EMAIL) {
    return (
      <Wrapper>
        <Alert> Confirmation email has been sent</Alert>
      </Wrapper>
    );
  }
  if (type.toUpperCase() === IdentityTypes.PHONE) {
    return (
      <Wrapper>
        <Alert>Confirmation SMS has been sent</Alert>
      </Wrapper>
    );
  }
  return null;
};

export default AlertBar;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Alert = styled.div`
  position: fixed;
  min-width: 25rem;
  max-width: 90%;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: 0.4rem;
  text-align: center;
  padding: 1.6rem;
  z-index: 1;
  top: 2rem;
  visibility: hidden;
  opacity: 0;
  animation: fadeinout 3s;

  @keyframes fadeinout {
    0%,
    100% {
      opacity: 0;
      visibility: hidden;
    }

    10%,
    90% {
      opacity: 1;
      visibility: visible;
    }
  }
`;
