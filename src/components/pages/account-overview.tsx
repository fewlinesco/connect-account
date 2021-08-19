import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { RightChevron } from "@src/components/icons/right-chevron";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import { NeutralLink } from "@src/components/neutral-link";
import { SectionBox } from "@src/components/section-box";
import { deviceBreakpoints } from "@src/design-system/theme";
import { getNavSectionHref } from "@src/utils/get-nav-section-href";

const AccountOverview: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      {getSectionListContent().map(([sectionName, { textID, icon }]) => {
        return (
          <SectionBox key={sectionName}>
            <SectionLink href={getNavSectionHref(sectionName)}>
              {icon}
              <TextBox>
                <SectionName>{formatMessage({ id: sectionName })}</SectionName>
                {formatMessage({ id: textID })}
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