import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

const StoriesContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 60%;
  margin: 0 auto;

  h1 {
    padding: 2.4rem 0 ${({ theme }) => theme.spaces.xxs};
  }

  h2 {
    margin: 0 0 ${({ theme }) => theme.spaces.xxs} 0;
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
  }

  @media ${deviceBreakpoints.m} {
    width: 90%;
  }
`;

export { StoriesContainer };
