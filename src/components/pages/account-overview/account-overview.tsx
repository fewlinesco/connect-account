import { HttpStatus } from "@fwl/web";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { Profile } from "@src/@types/profile";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { deviceBreakpoints } from "@src/design-system/theme";
import { SWRError } from "@src/errors/errors";

const AccountOverview: React.FC = () => {
  const { data: userProfile } = useSWR<Profile, SWRError>(
    `/api/profile/user-profile`,
    async (url) => {
      return await fetch(url).then(async (response) => {
        if (!response.ok) {
          const error = new SWRError(
            "An error occurred while fetching the data.",
          );

          if (response.status === HttpStatus.NOT_FOUND) {
            error.info = await response.json();
            error.statusCode = response.status;
            return;
          }

          error.info = await response.json();
          error.statusCode = response.status;
          throw error;
        }

        return response.json();
      });
    },
  );

  return (
    <>
      {getSectionListContent(userProfile ? false : true).map(
        ([sectionName, { text, icon }]) => {
          const sectionHref =
            sectionName.toLocaleLowerCase() === "personal_information"
              ? "/account/profile"
              : sectionName.toLocaleLowerCase() === "create_your_profile"
              ? "/account/profile/user-profile/new"
              : `/account/${sectionName.toLocaleLowerCase()}`;

          return (
            <SectionBox key={sectionName}>
              <SectionLink href={sectionHref}>
                {icon}
                <TextBox>
                  <SectionName>{sectionName.replace(/_/g, " ")}</SectionName>
                  {text}
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
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeights.title};

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
