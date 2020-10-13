import React from "react";

import Home from "./Home";

export default { title: "pages/Home", component: Home };

export const HomePage = (): JSX.Element => {
  return <Home authorizeURL={"#"} />;
};
