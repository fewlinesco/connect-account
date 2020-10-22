import React from "react";

import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs";

export default {
  title: "components/Navigation Breadcrumbs",
  component: NavigationBreadcrumbs,
};

export const OneLevelNavigationBreadcrumbs = (): JSX.Element => {
  return <NavigationBreadcrumbs breadcrumbs={["Phone number"]} />;
};

export const TwoLevelsNavigationBreadcrumbs = (): JSX.Element => {
  return <NavigationBreadcrumbs breadcrumbs={["Phone number", "validation"]} />;
};
