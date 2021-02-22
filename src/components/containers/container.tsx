import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;

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
    height: auto;
    margin: 0 0 10rem 0;
  }
`;

export { Container };
