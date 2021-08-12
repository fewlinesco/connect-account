import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR from "swr";

import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";

const Security: React.FC = () => {
  const { data: isPasswordSet, error } = useSWR<string, Error>(
    "/api/auth-connect/is-password-set/",
  );

  if (error) {
    throw error;
  }

  const { formatMessage } = useIntl();

  return (
    <>
      <h3>{formatMessage({ id: "sectionTitle" })}</h3>
      <SectionBox>
        <SecurityLink href={!isPasswordSet ? "#" : "/account/security/update/"}>
          {!isPasswordSet ? (
            <SkeletonTextLine fontSize={1.4} width={50} />
          ) : (
            <p>
              {JSON.parse(isPasswordSet)
                ? formatMessage({ id: "updatePassword" })
                : formatMessage({ id: "setPassword" })}
            </p>
          )}
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
  padding: 0 ${({ theme }) => theme.spaces.xs};
  cursor: pointer;
  height: 7.2rem;
  font-size: ${({ theme }) => theme.fontSizes.s};
`;

export { Security };
