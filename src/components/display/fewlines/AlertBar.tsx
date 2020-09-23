import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "@lib/@types/Identity";

export const AlertBar: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  if (type === IdentityTypes.EMAIL) {
    return <Alert>Confirmation email has been sent</Alert>;
  }
  if (type === IdentityTypes.PHONE) {
    return <Alert>Confirmation SMS has been sent</Alert>;
  }
  return null;
};

export default AlertBar;

const Alert = styled.div`
  visibility: visible;
  min-width: 250px;
  margin-left: -125px;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.background};
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
`;
