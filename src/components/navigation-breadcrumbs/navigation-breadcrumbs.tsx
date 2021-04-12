import React from "react";

import { SkeletonTextLine } from "../skeletons/skeletons";

const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string;
}> = ({ breadcrumbs }) => {
  if (breadcrumbs === "") {
    return (
      <h3>
        <SkeletonTextLine fontSize={1.4} />
      </h3>
    );
  }

  return <h3>{breadcrumbs}</h3>;
};

export { NavigationBreadcrumbs };
