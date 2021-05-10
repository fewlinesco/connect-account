import React from "react";
import styled from "styled-components";

import { LoginsIcon } from "@src/components/icons/logins-icon/logins-icon";
import { ProfileIcon } from "@src/components/icons/profile-icon/profile-icon";
import { RightChevron } from "@src/components/icons/right-chevron/right-chevron";
import { SecurityIcon } from "@src/components/icons/security-icon/security-icon";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { configVariables } from "@src/configs/config-variables";
import { deviceBreakpoints } from "@src/design-system/theme";

const SECTION_LIST_CONTENT = {
  PERSONAL_INFORMATION: {
    text: "NEED REFINEMENT - Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    icon: <ProfileIcon />,
  },
  LOGINS: {
    text: "Manage your logins options, including emails, phone numbers and social logins",
    icon: <LoginsIcon />,
  },
  SECURITY: {
    text: "Set or change your password. You can check your connections history here",
    icon: <SecurityIcon />,
  },
};

const AccountOverview: React.FC = () => {
  return (
    <>
      {Object.entries(SECTION_LIST_CONTENT).map(
        ([sectionName, { text, icon }]) => {
          const sectionHref =
            sectionName.toLocaleLowerCase() === "personal_information"
              ? "/account/profile"
              : `/account/${sectionName.toLocaleLowerCase()}`;

          if (
            !configVariables.featureFlag &&
            sectionHref === "/account/profile"
          ) {
            return <React.Fragment key={sectionName} />;
          }

          return (
            <SectionBox key={sectionName}>
              <SectionLink href={sectionHref}>
                {icon}
                <TextBox>
                  <SectionName>{sectionName.replace("_", " ")}</SectionName>
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
    max-width: 60%;
  }
`;

const SectionName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tracked};
`;

export { SECTION_LIST_CONTENT, AccountOverview };
