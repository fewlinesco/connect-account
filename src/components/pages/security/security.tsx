import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SecuritySkeleton } from "@src/components/skeletons/skeletons";
import { configVariables } from "@src/configs/config-variables";

const Security: React.FC = () => {
  const { data, error } = useSWR<{ isPasswordSet: boolean }, Error>(
    `${configVariables.connectAccountURL}/api/auth-connect/is-password-set`,
    (url) => fetch(url).then((response) => response.json()),
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

const TextBox = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.title};
  max-width: 50%;
`;

export { Security };
