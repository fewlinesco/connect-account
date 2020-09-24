import React from "react";
import styled from "styled-components";

export const NavigationBreadcrumbs: React.FC<{
  title: string;
  breadcrumbs: string;
}> = ({ title, breadcrumbs }) => {
  return (
    <Wrapper>
      <h2>{title}</h2>
      <p>{breadcrumbs}</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 0 ${({ theme }) => theme.spaces.component.s} 0;

  p {
    font-weight: ${({ theme }) => theme.fontWeights.light};
    font-size: ${({ theme }) => theme.fontSizes.s};
  }
`;
