import React from "react";

import { NavigationBarIconContainer } from "../../containers/navigation-bar-icon-container";

export const KeyIcon: React.FC = () => {
  return (
    <NavigationBarIconContainer>
      <svg
        width="40"
        height="40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.412 24.532l.238 3.868-2.93.795.777 2.935-5.397 1.857-1.09-5.603 6.387-11.063a8.08 8.08 0 01-.135-8.327c2.23-3.863 7.15-5.197 10.988-2.981 3.84 2.216 5.143 7.144 2.913 11.006a8.08 8.08 0 01-7.279 4.047"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="24.885"
          cy="10.885"
          r="1.885"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </NavigationBarIconContainer>
  );
};
