import React from "react";
import styled from "styled-components";

export const NavigationBreadcrumbs: React.FC<{
  title: string;
  breadcrumbs: string;
}> = ({ title, breadcrumbs }) => {
  return (
    <Wrapper>
      <h1>{title}</h1>
      <p>{breadcrumbs}</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spaces.component.xs} 0
    ${({ theme }) => theme.spaces.component.s};

  h1 {
    margin: 0 0 ${({ theme }) => theme.spaces.component.xxs} 0;
  }

  p {
    font-weight: ${({ theme }) => theme.fontWeights.light};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;
