import React from "react";

import { NavigationBreadcrumbs } from "./navigation-breadcrumbs";

const OneLevelNavigationBreadcrumbs = (): JSX.Element => {
  return <NavigationBreadcrumbs breadcrumbs="Phone number" />;
};

const TwoLevelsNavigationBreadcrumbs = (): JSX.Element => {
  return <NavigationBreadcrumbs breadcrumbs="Phone number | validation" />;
};

export { OneLevelNavigationBreadcrumbs, TwoLevelsNavigationBreadcrumbs };
export default {
  title: "components/Navigation Breadcrumbs",
  component: NavigationBreadcrumbs,
};
