import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

export const Main = styled.main`
  width: 100%;
  height: 100vh;
  max-width: 88rem;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    height: auto;
  }
`;

export const Flex = styled.div`
  display: flex;
`;

export const DesktopNavigationBarWrapper = styled.div`
  min-width: 24rem;
  width: 30%;

  @media ${deviceBreakpoints.m} {
    display: none;
  }
`;

export const ChildrenContainer = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;

export const MobileDisplayOnly = styled.div`
  display: none;

  @media ${deviceBreakpoints.m} {
    display: block;
  }
`;
