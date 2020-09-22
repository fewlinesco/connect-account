import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../../../@types/Identity";

export const AlertBar: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  if (type.toUpperCase() === IdentityTypes.EMAIL) {
    return <Alert> Confirmation email has been sent</Alert>;
  }
  if (type.toUpperCase() === IdentityTypes.PHONE) {
    return <Alert>Confirmation SMS has been sent</Alert>;
  }
  return null;
};

export default AlertBar;

const Alert = styled.div`
  position: fixed;
  min-width: 25rem;
  max-width: 90%;
  margin-left: -12.5rem;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  border-radius: 0.4rem;
  text-align: center;
  padding: 1.6rem;
  z-index: 1;
  left: 50%;
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

    20%,
    80% {
      opacity: 1;
      visibility: visible;
    }
  }
`;
