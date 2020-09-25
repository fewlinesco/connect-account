import React from "react";
import style from "styled-components";

import { RightChevron } from "../RightChevron";

export const BoxedLink: React.FC<{
  value: string;
  primary: boolean;
  status: "validated" | "unvalidated";
}> = ({ value, primary, status }) => {
  let className = "lighter";
  if (primary) {
    className = "bold";
  } else if (status === "validated") {
    className = "normal";
  }
  return (
    <Box>
      <p className={className}>{value}</p>
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

    .bold {
      font-weight: bold;
    }

    .normal {
      font-weight: normal;
    }

    .lighter {
      font-weight: lighter;
    }
`;
