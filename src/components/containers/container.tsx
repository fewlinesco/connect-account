import styled from "styled-components";

import { deviceBreakpoints } from "@src/design-system/theme";

const Container = styled.div`
  width: 100%;
  height: 100%;

  @media ${deviceBreakpoints.m} {
    height: auto;
    margin: 0 0 10rem 0;
  }
`;

export { Container };
