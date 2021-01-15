import React from "react";
import styled from "styled-components";

import { RightChevron } from "../icons/right-chevron/right-chevron";
import { NeutralLink } from "../neutral-link/neutral-link";
import { SectionBox } from "../shadow-box/section-box";

type SecurityProps = {
  isPasswordSet: boolean;
};

export const Security: React.FC<SecurityProps> = ({ isPasswordSet }) => {
  return (
    <>
      <h2>Password</h2>
      <SectionBox>
        <SecurityLink href="/account/security/update">
          <TextBox>{isPasswordSet ? "Update" : "Set"} your password</TextBox>
          <RightChevron />
        </SecurityLink>
      </SectionBox>
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
