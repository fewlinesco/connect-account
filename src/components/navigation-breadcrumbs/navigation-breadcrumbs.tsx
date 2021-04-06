import React from "react";
import styled from "styled-components";

import { BreadcrumbsSkeleton } from "../skeletons/skeletons";

const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string[] | string;
}> = ({ breadcrumbs }) => {
  if (breadcrumbs === "") {
    return <BreadcrumbsSkeleton />;
  }

  if (typeof breadcrumbs === "string") {
    return <Breadcrumbs>{breadcrumbs}</Breadcrumbs>;
  }
  return <Breadcrumbs>{breadcrumbs.join(" | ")}</Breadcrumbs>;
};

const Breadcrumbs = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.s};
`;

export { NavigationBreadcrumbs, Breadcrumbs };
