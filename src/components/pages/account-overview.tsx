import React from "react";
import { useIntl } from "react-intl";

import { Button } from "../buttons";
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
            <NeutralLink
              className="p-8 flex items-center justify-between"
              href={getNavSectionHref(sectionName)}
            >
              {icon}
              <div className="text-s leading-loose w-3/5 md:w-9/12">
                <p className="text-m font-semibold tracking-widest">
                  {formatMessage({ id: sectionName })}
                </p>
                {formatMessage({ id: textID })}
              </div>
              <RightChevron />
            </NeutralLink>
          </SectionBox>
        );
      })}
      <Button
        type="button"
        className="btn btn-primary"
        onPress={() => {
          throw new Error("Checking Sentry init");
        }}
      >
        Press me{" "}
      </Button>
    </>
  );
};

export { AccountOverview };
