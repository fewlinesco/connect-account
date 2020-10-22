import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { RightChevron } from "../Icons/RightChevron/RightChevron";
import { NeutralLink } from "../NeutralLink/NeutralLink";
import { ShadowBox } from "../ShadowBox/ShadowBox";

type SecurityProps = {
  isPasswordSet: boolean;
};

export const Security: React.FC<SecurityProps> = ({ isPasswordSet }) => {
  return (
    <ShadowBox>
      <Link href={`/account/security/${isPasswordSet ? "update" : "set"}`}>
        <NeutralLink>
          <Flex>
            <TextBox>{isPasswordSet ? "Update" : "Set"} your password</TextBox>
            <RightChevron />
          </Flex>
        </NeutralLink>
      </Link>
    </ShadowBox>
  );
};

const Flex = styled.div`
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
