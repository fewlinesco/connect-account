import React from "react";

import { SkeletonTextLine } from "./skeletons";

const NavigationBreadcrumbs: React.FC<{
  breadcrumbs: string | false;
}> = ({ breadcrumbs }) => {
  if (breadcrumbs === "") {
    return (
      <h2>
        <SkeletonTextLine fontSize={1.4} width={40} />
      </h2>
    );
  }

  if (!breadcrumbs) {
    return null;
  }

  return <h2>{breadcrumbs}</h2>;
};

export { NavigationBreadcrumbs };
