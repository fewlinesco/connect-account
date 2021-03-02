import React from "react";
import styled from "styled-components";

const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string[];
}> = ({ breadcrumbs }) => {
  return <Breadcrumbs>{breadcrumbs.join(" | ")}</Breadcrumbs>;
};

const Breadcrumbs = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s};
`;

export { NavigationBreadcrumbs, Breadcrumbs };
