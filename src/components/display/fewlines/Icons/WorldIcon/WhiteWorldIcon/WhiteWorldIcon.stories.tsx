import React from "react";
import styled from "styled-components";

import { WhiteWorldIcon } from "./WhiteWorldIcon";

export default {
  title: "icons/WorldIcon",
  component: WhiteWorldIcon,
};

export const StandardWorldIcon = (): JSX.Element => {
  return (
    <Wrapper>
      <WhiteWorldIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
