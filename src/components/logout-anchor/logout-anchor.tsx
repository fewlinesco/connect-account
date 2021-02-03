import React from "react";
import styled from "styled-components";

import { NeutralLink } from "../neutral-link/neutral-link";
import { deviceBreakpoints } from "@src/design-system/theme";

const LogoutAnchor: React.FC = () => {
  return (
    <LogoutStyle>
      <NeutralLink
        href="/"
        onClick={() => {
          document.cookie = 'user-cookie=""; Max-Age=0';
        }}
      >
        Logout
      </NeutralLink>
    </LogoutStyle>
  );
};

const LogoutStyle = styled.div`
  margin: 2rem 0 0 2rem;

  @media ${deviceBreakpoints.m} {
    padding-bottom: 2rem;
  }

  a {
    color: ${({ theme }) => theme.colors.lightGrey};

    &:hover {
      color: ${({ theme }) => theme.colors.black};
    }
  }
`;

export { LogoutAnchor };
