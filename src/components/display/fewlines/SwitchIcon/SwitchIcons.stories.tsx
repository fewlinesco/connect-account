import React from "react";
import styled from "styled-components";

import { SwitchIcon } from "./SwitchIcon";

export default {
  title: "icons/SwitchIcon",
  component: SwitchIcon,
};

export const StandardlSwitchIcon = (): JSX.Element => {
  return (
    <Wrapper>
      <SwitchIcon />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.blacks[4]};
`;
