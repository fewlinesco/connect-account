import styled from "styled-components";

export const H2 = styled.h2`
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: ${({ theme }) => theme.fontSizes.s};
  color: ${({ theme }) => theme.colors.breadcrumbs};
  margin: 0 0 ${({ theme }) => theme.spaces.s} 0;
`;
