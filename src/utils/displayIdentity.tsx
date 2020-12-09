import React from "react";
import styled from "styled-components";

import { Identity } from "@lib/@types";
import { RightChevron } from "@src/components/display/fewlines/Icons/RightChevron/RightChevron";

export const displayIdentity = (identity: Identity): JSX.Element => {
  return (
    <>
      <IdentityValue primary={identity.primary} status={identity.status}>
        {identity.value}
      </IdentityValue>
      <RightChevron />
    </>
  );
};

const IdentityValue = styled.p<Pick<Identity, "primary" | "status">>`
  ${(props) =>
    props.primary &&
    `
      font-weight: ${props.theme.fontWeights.semibold};
    `}

  ${(props) =>
    props.status === "unvalidated" &&
    `
      color: ${props.theme.colors.lightGrey};
    `};
`;
