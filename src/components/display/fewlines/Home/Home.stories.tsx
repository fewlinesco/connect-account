import React from "react";
import styled from "styled-components";

import Home from "./Home";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export default { title: "pages/Home", component: Home };

export const HomePage = (): JSX.Element => {
  return (
    <Wrapper>
      {" "}
      <Home authorizeURL={"#"} />{" "}
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
