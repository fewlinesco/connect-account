import React from "react";
import styled from "styled-components";

export const EditIcon: React.FC = () => {
  return (
    <Button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    </Button>
  );
};

const Button = styled.button<{ color: string }>`
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
`;
