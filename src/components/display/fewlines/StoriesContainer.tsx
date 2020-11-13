import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

export const StoriesContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 60%;
  margin: 0 auto;

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;
