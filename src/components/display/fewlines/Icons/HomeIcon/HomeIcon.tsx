import React from "react";

import { NavigationBarIconContainer } from "../../NavigationBarIconContainer";

export const HomeIcon: React.FC = () => {
  return (
    <NavigationBarIconContainer>
      <svg
        width="30"
        height="26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.846 10.046L16.094 1.715a2 2 0 00-2.188 0L1.154 10.046h5.538V25H23V14.539a2 2 0 00-2-2h-4a2 2 0 00-2 2v3.156"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </NavigationBarIconContainer>
  );
};
