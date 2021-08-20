import React from "react";
import { useIntl } from "react-intl";

import { ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { HomeDesktopBackground } from "@src/components/icons/home-desktop-background";
import { HomeMobileBackground } from "@src/components/icons/home-mobile-background";
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
      <div className="bg-background mb-4 rounded shadow-box w-4/5 lg:max-w-2xl flex flex-col justify-center p-16 absolute right-1/2 top-28 lg:top-1/2 transform translate-x-1/2 lg:-translate-y-1/2">
        <p className="text-center mb-8 font-semibold">
          {formatMessage({ id: "info" })} {providerName}
        </p>
        <NeutralLink href={authorizeURL}>
          <FakeButton variant={ButtonVariant.PRIMARY}>
            {formatMessage({ id: "callToAction" })}
          </FakeButton>
        </NeutralLink>
      </div>
    </>
  );
};

export { Home };
