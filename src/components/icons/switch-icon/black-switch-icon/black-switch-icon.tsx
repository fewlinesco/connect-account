import React from "react";

import { NavigationBarIconContainer } from "../../../containers/navigation-bar-icon-container";

export const BlackSwitchIcon: React.FC = () => {
  return (
    <NavigationBarIconContainer>
      <svg
        width="18"
        height="20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 15l4-4m0-6h12H5zm12 0l-4-4 4 4zm0 0l-4 4 4-4zm-4 10H1h12zM1 15l4 4-4-4z"
          stroke="#03083C"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </NavigationBarIconContainer>
  );
};
