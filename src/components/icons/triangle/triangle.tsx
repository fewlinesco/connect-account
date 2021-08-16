import React from "react";

const Triangle: React.FC<{ rotate: boolean }> = ({ rotate }) => {
  return (
    <svg
      width="11"
      height="5"
      viewBox="0 0 11 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={rotate ? "mt-1 transform rotate-180" : ""}
    >
      <path d="M10.5 5L5.50003 5.96244e-08L0.500031 5L10.5 5Z" fill="#03083C" />
    </svg>
  );
};

export { Triangle };
