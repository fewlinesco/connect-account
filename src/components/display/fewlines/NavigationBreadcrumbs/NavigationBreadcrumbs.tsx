import React from "react";
import styled from "styled-components";

export const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string[];
}> = ({ breadcrumbs }) => {
  return <Breadcrumbs>{breadcrumbs.join(" | ")}</Breadcrumbs>;
};

export const Breadcrumbs = styled.div`
  padding: 0 0 ${({ theme }) => theme.spaces.s};
  font-size: ${({ theme }) => theme.fontSizes.s};
`;
