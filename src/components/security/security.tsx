import React from "react";
import styled from "styled-components";

import { RightChevron } from "../display/fewlines/Icons/RightChevron/RightChevron";
import { NeutralLink } from "../display/fewlines/NeutralLink/NeutralLink";
import { ShadowBox } from "../display/fewlines/ShadowBox/ShadowBox";

type SecurityProps = {
  isPasswordSet: boolean;
};

export const Security: React.FC<SecurityProps> = ({ isPasswordSet }) => {
  return (
    <>
      <h2>Password</h2>
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
