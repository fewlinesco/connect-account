import React from "react";
import styled from "styled-components";

export const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string[];
}> = ({ breadcrumbs }) => {
  return (
    <Wrapper>
      <p>{breadcrumbs.join(" | ")}</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 0 ${({ theme }) => theme.spaces.component.s};

  p {
    font-weight: ${({ theme }) => theme.fontWeights.light};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;
