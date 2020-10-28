import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: scroll;

  @media ${deviceBreakpoints.m} {
    height: auto;
  }
`;
