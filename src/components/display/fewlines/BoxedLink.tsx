import React from "react";
import style from "styled-components";

import { RightChevron } from "./RightChevron";

export const BoxedLink: React.FC<{ value: string }> = ({ value }) => {
  return (
    <Box>
      <p>{value}</p>
      <RightChevron />
    </Box>
  );
};

const Box = style.div`
    height: 7.2rem;
    margin: 0 ${({ theme }) => theme.spaces.component.xs};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
