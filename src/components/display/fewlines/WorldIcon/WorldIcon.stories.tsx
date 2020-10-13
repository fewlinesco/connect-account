import React from "react";
import styled from "styled-components";

import { WorldIcon } from "./WorldIcon";

export default {
  title: "icons/WorldIcon",
  component: WorldIcon,
};

export const StandardlWorldIcon = (): JSX.Element => {
  return (
    <Wrapper>
      <WorldIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
