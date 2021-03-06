import React from "react";

const WhiteWorldIcon: React.FC = () => {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" stroke="#fff" />
      <ellipse cx="12" cy="12" rx="5" ry="11" stroke="#fff" />
      <path d="M12 1v22" stroke="#fff" />
      <path d="M20 12H4M19 7H5M19 17H5" stroke="#fff" strokeLinecap="round" />
    </svg>
  );
};

export { WhiteWorldIcon };
