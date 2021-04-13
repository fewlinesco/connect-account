import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SecuritySkeleton } from "@src/components/skeletons/skeletons";

const Security: React.FC = () => {
  const { data, error } = useSWR<{ isPasswordSet: boolean }, Error>(
    "/api/auth-connect/is-password-set",
  );

  if (error) {
    throw error;
  }

  return (
    <>
      <h2>Password</h2>
      {!data ? (
        <SecuritySkeleton />
      ) : (
        <SectionBox>
          <SecurityLink href="/account/security/update">
            <TextBox>
              {data.isPasswordSet ? "Update" : "Set"} your password
            </TextBox>
            <RightChevron />
          </SecurityLink>
        </SectionBox>
      )}
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

const TextBox = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.title};
`;

export { Security };
