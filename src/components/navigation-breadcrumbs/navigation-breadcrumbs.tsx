import React from "react";

import { SkeletonTextLine } from "../skeletons/skeletons";

const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string | false;
}> = ({ breadcrumbs }) => {
  if (breadcrumbs === "") {
    return (
      <h3>
        <SkeletonTextLine fontSize={1.4} />
      </h3>
    );
  }

  if (!breadcrumbs) {
    return null;
  }

  return <h3>{breadcrumbs}</h3>;
};

export { NavigationBreadcrumbs };
