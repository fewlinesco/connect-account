import React from "react";
import styled from "styled-components";

import { RightChevron } from "../Icons/RightChevron/RightChevron";

type BoxedLinkProps = {
  value: string;
  primary: boolean;
  status: "validated" | "unvalidated";
};

export const BoxedLink: React.FC<BoxedLinkProps> = ({
  value,
  primary,
  status,
}) => {
  return (
    <Box primary={primary} status={status}>
      <p>{value}</p>
      <RightChevron />
    </Box>
  );
};

const Box = styled.div<Pick<BoxedLinkProps, "primary" | "status">>`
  height: 7.2rem;
  padding: 0 ${({ theme }) => theme.spaces.xs};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .bold {
    font-weight: bold;
  }

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
