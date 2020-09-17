import React from "react";
import styled from "styled-components";

import { Triangle } from "./Triangle";

export const ShowMoreButton: React.FC<{
  hide: boolean;
  quantity: number;
  setHideSecondary: (value: boolean) => void;
}> = ({ hide, quantity, setHideSecondary }) => {
  return (
    <Button onClick={() => setHideSecondary(!hide)}>
      {hide ? (
        <div>
          Show {quantity} more <Triangle rotate={hide} />
        </div>
      ) : (
        <div>
          Hide {quantity} <Triangle rotate={hide} />
        </div>
      )}
    </Button>
  );
};

export const Button = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  &:hover {
    cursor: pointer;
  }
`;
