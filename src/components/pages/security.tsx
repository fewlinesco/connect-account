import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { SectionBox } from "@src/components/boxes";
import { RightChevron } from "@src/components/icons/right-chevron";
import { NeutralLink } from "@src/components/neutral-link";
import { SkeletonTextLine } from "@src/components/skeletons/skeletons";
import { SWRError } from "@src/errors/errors";

const Security: React.FC = () => {
  const { data, error } = useSWR<{ isPasswordSet: boolean }, SWRError>(
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
        <NeutralLink
          className="link-boxed h-28"
          href={!data ? "#" : "/account/security/update/"}
        >
          {!data ? (
            <SkeletonTextLine fontSize={1.4} width={50} />
          ) : (
            <p>
              {data.isPasswordSet
                ? formatMessage({ id: "updatePassword" })
                : formatMessage({ id: "setPassword" })}
            </p>
          )}
          <RightChevron />
        </NeutralLink>
      </SectionBox>
    </>
  );
};

export { Security };
