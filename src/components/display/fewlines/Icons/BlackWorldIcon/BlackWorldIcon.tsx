import React from "react";

import { NavigationBarIconContainer } from "../../NavigationBarIconContainer";

export const BlackWorldIcon: React.FC = () => {
  return (
    <NavigationBarIconContainer>
      <svg
        width="24"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="11" stroke="#03083C" />
        <ellipse cx="12" cy="12" rx="5" ry="11" stroke="#03083C" />
        <path d="M12 1v22" stroke="#03083C" />
        <path
          d="M20 12H4M19 7H5M19 17H5"
          stroke="#03083C"
          strokeLinecap="round"
        />
      </svg>
    </NavigationBarIconContainer>
  );
};
