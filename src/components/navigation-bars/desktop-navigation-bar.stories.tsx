import React from "react";

import { DesktopNavigationBar } from "./desktop-navigation-bar";

const StandardDesktopNavigationBar = (): JSX.Element => {
  return <DesktopNavigationBar />;
};

export { StandardDesktopNavigationBar };
export default {
  title: "components/Desktop Navigation Bar",
  component: DesktopNavigationBar,
};
