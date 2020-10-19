import React from "react";
import styled from "styled-components";

import Account from "./Account";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export default { title: "pages/Account", component: Account };

export const AccountPage = (): JSX.Element => {
  return (
    <Wrapper>
      <Account />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;
