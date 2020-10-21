import React from "react";
import styled from "styled-components";

import { WhiteSwitchIcon } from "./WhiteSwitchIcon";

export default {
  title: "icons/SwitchIcon",
  component: WhiteSwitchIcon,
};

export const StandardSwitchIcon = (): JSX.Element => {
  return (
    <Wrapper>
      <WhiteSwitchIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
