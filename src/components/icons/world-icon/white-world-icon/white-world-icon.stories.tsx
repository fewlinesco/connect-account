import React from "react";
import styled from "styled-components";

import { WhiteWorldIcon } from "./white-world-icon";

const StandardWorldIcon = (): JSX.Element => {
  return (
    <Wrapper>
      <WhiteWorldIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;

export { StandardWorldIcon };
export default {
  title: "icons/World Icon",
  component: WhiteWorldIcon,
};
