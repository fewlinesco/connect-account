import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

export const Container = styled.div`
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;
