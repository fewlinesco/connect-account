import React from "react";
import styled from "styled-components";

import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { NeutralLink } from "../NeutralLink";
import { ShadowBox } from "../ShadowBox/ShadowBox";

type SecurityProps = {
  isPasswordSet: boolean;
};

export const Security: React.FC<SecurityProps> = ({ isPasswordSet }) => {
  return (
    <>
      <h3>Password</h3>
      <ShadowBox>
        <SecurityLink href="/account/security/update">
          <TextBox>{isPasswordSet ? "Update" : "Set"} your password</TextBox>
          <RightChevron />
        </SecurityLink>
      </ShadowBox>
    </>
  );
};

const SecurityLink = styled(NeutralLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
`;

export const TextBox = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.title};
  max-width: 50%;
`;
