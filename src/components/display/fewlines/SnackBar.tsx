import React from "react";
import styled from "styled-components";

import { IdentityTypes } from "../../../@types/Identity";

export const SnackBar: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  let method;
  type.toUpperCase() === IdentityTypes.EMAIL
    ? (method = "mail")
    : (method = "SMS");
  return <Snack>Confirmation {method} has been sent</Snack>;
};

export default SnackBar;

const Snack = styled.div`
  visibility: visible;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
`;
