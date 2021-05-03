import React from "react";

const ProfileIcon: React.FC = () => {
  return (
    <svg width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#a)">
        <path
          d="M22.538 23.565c9.455 11.405 35.146-4.192 37.886 11.548-1.728 26.638-49.02 16.354-55.41 3.217-6.39-13.137 8.07-26.17 17.524-14.765z"
          fill="#DDDFF2"
        />
        <path
          d="M47 62h17.657C67.591 62 70 59.611 70 56.704V13.296C70 10.39 67.59 8 64.657 8H31.238C28.305 8 26 10.389 26 13.296V18M40 18h24M44 28h20M44 38h20"
          stroke="#03083C"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M36 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM54 51l3 3 5-6M25.844 44C19.078 44 13.56 50.504 12 59.315 18.662 67.287 28.342 72.74 39.167 74c.52-2.622.833-5.874.833-10.07C40 52.916 33.65 44 25.844 44z"
          stroke="#03083C"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="26"
          cy="32"
          r="7"
          stroke="#03083C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h80v80H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { ProfileIcon };
