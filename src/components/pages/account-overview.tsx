import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { SectionBox } from "@src/components/boxes";
import { RightChevron } from "@src/components/icons/right-chevron";
import { getSectionListContent } from "@src/components/navigation-bars/navigation-sections";
import { NeutralLink } from "@src/components/neutral-link";
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
              <div className="text-s leading-loose w-3/5 md:w-9/12">
                <p className="text-m font-semibold tracking-widest">
                  {formatMessage({ id: sectionName })}
                </p>
                {formatMessage({ id: textID })}
              </div>
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

export { AccountOverview };
