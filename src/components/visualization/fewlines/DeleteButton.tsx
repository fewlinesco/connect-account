import React from "react";
import styled from "styled-components";

type DeleteButtonProps = {
  deleteIdentity: () => Promise<Response>;
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  deleteIdentity,
}) => {
  return (
    <Button onClick={deleteIdentity}>
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
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
      </svg>
    </Button>
  );
};

const Button = styled.button`
  padding: 0.5rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: transparent;
  transition: ${({ theme }) => theme.transitions.quick};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    cursor: pointer;
  }

  &:active {
    outline: none;
  }
`;
