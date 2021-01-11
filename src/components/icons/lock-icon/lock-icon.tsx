import React from "react";

import { NavigationBarIconContainer } from "../../navigation-bar-icon-container";

export const LockIcon: React.FC = () => {
  return (
    <NavigationBarIconContainer>
      <svg
        width="25"
        height="30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="11"
          width="23"
          height="18"
          rx="1"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="12.885"
          cy="18.885"
          r="1.885"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13 21v4M9 10V4c0-1 .7-3 3.5-3S16 3 16 4v6"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </NavigationBarIconContainer>
  );
};
