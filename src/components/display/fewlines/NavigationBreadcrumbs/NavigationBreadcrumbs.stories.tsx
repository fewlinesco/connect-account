import React from "react";

import { NavigationBreadcrumbs } from "./NavigationBreadcrumbs";

export default {
  title: "NavigationBreadcrumbs",
  component: NavigationBreadcrumbs,
};

export const StandardNavigationBreadcrumbs = (): JSX.Element => {
  return <NavigationBreadcrumbs title="Logins" />;
};
