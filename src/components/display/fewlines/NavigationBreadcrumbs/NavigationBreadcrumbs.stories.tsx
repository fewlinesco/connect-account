import React from "react";

import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs";

export default {
  title: "components/NavigationBreadcrumbs",
  component: NavigationBreadcrumbs,
};

export const StandardNavigationBreadcrumbs = (): JSX.Element => {
  return <NavigationBreadcrumbs breadcrumbs={["Phone number", "validation"]} />;
};
