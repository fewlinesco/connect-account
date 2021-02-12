import React from "react";
import styled from "styled-components";

import { WhiteSwitchIcon } from "./white-switch-icon";

const StandardSwitchIcon = (): JSX.Element => {
  return (
    <Wrapper>
      <WhiteSwitchIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;

export { StandardSwitchIcon };
export default {
  title: "icons/Switch Icon",
  component: WhiteSwitchIcon,
};
