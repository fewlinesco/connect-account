import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { deviceBreakpoints } from "@src/design-system/theme";
import { SWRError } from "@src/errors/errors";
import { navigationFetcher } from "@src/queries/swr-navigation-fetcher";
import { getNavSectionHref } from "@src/utils/getNavSectionHref";

const AccountOverview: React.FC = () => {
  const { data: userProfile } = useSWR<Profile, SWRError>(
    `/api/profile/user-profile`,
    navigationFetcher,
  );

  const { formatMessage } = useIntl();

  return (
    <>
      {getSectionListContent(userProfile ? false : true).map(
        ([sectionName, { textID, icon }], index) => {
          if (index === 0 && !userProfile) {
            return (
              <SectionBox key={sectionName}>
                <SectionLink href={getNavSectionHref(sectionName)}>
                  {icon}
                  <TextBox>
                    <SkeletonTextLine fontSize={1.6} width={50} />
                    <SkeletonTextLine fontSize={1.6} width={100} />
                  </TextBox>
                  <RightChevron />
                </SectionLink>
              </SectionBox>
            );
          }

          return (
            <SectionBox key={sectionName}>
              <SectionLink href={getNavSectionHref(sectionName)}>
                {icon}
                <TextBox>
                  <SectionName>
                    {formatMessage({ id: sectionName })}
                  </SectionName>
                  {formatMessage({ id: textID })}
                </TextBox>
                <RightChevron />
              </SectionLink>
            </SectionBox>
          );
        },
      )}
    </>
  );
};

const SectionLink = styled(NeutralLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaces.xs};
`;

const TextBox = styled.div`
  max-width: 70%;
  flex-grow: 2;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.title};

  div {
    margin: 1.5rem 0;
  }

  @media ${deviceBreakpoints.m} {
    max-width: 50%;
  }

  @media ${deviceBreakpoints.s} {
    max-width: 60%;
  }
`;

const SectionName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tracked};
`;

export { AccountOverview };
