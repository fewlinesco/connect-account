import React from "react";
import styled from "styled-components";

import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { configVariables } from "@src/configs/config-variables";
import { useUserProfile } from "@src/contexts/user-profile-context";
import { deviceBreakpoints } from "@src/design-system/theme";

const AccountOverview: React.FC = () => {
  const { userProfileFetchedResponse } = useUserProfile();

  if (!userProfileFetchedResponse) {
    return <React.Fragment />;
  }

  return (
    <>
      {getSectionListContent(
        userProfileFetchedResponse.error ? true : false,
      ).map(([sectionName, { text, icon }]) => {
        const sectionHref =
          sectionName.toLocaleLowerCase() === "personal_information"
            ? "/account/profile"
            : sectionName.toLocaleLowerCase() === "create_your_profile"
            ? "/account/profile/user-profile/new"
            : `/account/${sectionName.toLocaleLowerCase()}`;

        if (
          (!configVariables.featureFlag &&
            sectionHref === "/account/profile") ||
          (!configVariables.featureFlag &&
            sectionHref === "/account/profile/user-profile/new")
        ) {
          return <React.Fragment key={sectionName} />;
        }

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
      })}
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
