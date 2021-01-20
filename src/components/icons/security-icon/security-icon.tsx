import React from "react";

export const SecurityIcon: React.FC = () => {
  return (
    <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="8"
        y="15"
        width="23"
        height="19"
        rx="2"
        stroke="#03083C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="19.885"
        cy="22.885"
        r="1.885"
        stroke="#03083C"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 25v4M16 14V8c0-1 .7-3 3.5-3S23 7 23 8v6"
        stroke="#03083C"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
