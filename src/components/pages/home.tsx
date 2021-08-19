import React from "react";
import { useIntl } from "react-intl";

import { SectionBox } from "@src/components/boxes";
import { ButtonVariant } from "@src/components/buttons";
import { HomeDesktopBackground } from "@src/components/icons/home-desktop-background";
import { HomeMobileBackground } from "@src/components/icons/home-mobile-background";
import { LinkStyledAsButton } from "@src/components/link-styled-as-button";
import { NeutralLink } from "@src/components/neutral-link";

const Home: React.FC<{ authorizeURL: string; providerName: string }> = ({
  authorizeURL,
  providerName,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <HomeDesktopBackground />
      <HomeMobileBackground />
      <SectionBox className="w-4/5 lg:max-w-2xl flex flex-col justify-center p-16 absolute right-1/2 top-28 lg:top-1/2 transform translate-x-1/2 lg:-translate-y-1/2">
        <p className="text-center mb-8 font-semibold">
          {formatMessage({ id: "info" })} {providerName}
        </p>
        <NeutralLink href={authorizeURL}>
          <LinkStyledAsButton variant={ButtonVariant.PRIMARY}>
            {formatMessage({ id: "callToAction" })}
          </LinkStyledAsButton>
        </NeutralLink>
      </SectionBox>
    </>
  );
};

export { Home };
