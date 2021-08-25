import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { CookieButton, Button } from "./buttons";
import { SentryIcon } from "./icons/sentry-icon";
import { ModalOverlay } from "./modal-overlay";
import { formatCookieBannerMessage } from "@src/configs/intl";
import { SWRError } from "@src/errors/errors";
import { fetchJson } from "@src/utils/fetch-json";

const CookieBanner: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const { data: consentCookie } = useSWR<Record<string, string>, SWRError>(
    `/api/consent-cookie/`,
    { refreshInterval: 0 },
  );

  React.useEffect(() => {
    if (consentCookie && !consentCookie.isSet) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [consentCookie]);

  return (
    <div className="fixed w-full bottom-0 left-0 lg:left-8 lg:bottom-8 z-20">
      <CookieButton
        onPress={() => setIsModalOpen(!isModalOpen)}
        isOpen={isModalOpen}
      />
      {isModalOpen ? (
        <>
          <div className="w-full lg:max-w-2xl absolute bottom-0 left-0 lg:bottom-20 lg:left-8 bg-background shadow-box rounded z-20">
            <div className="pt-8 px-8 mb-5">
              <h2 className="text-xxl text-black mb-5 font-normal ">Cookies</h2>
              <p className="leading-tight mb-6">
                {formatCookieBannerMessage(
                  router.locale || "en",
                  "generalDescription",
                )}
              </p>
              <h3 className="font-medium mb-5">
                {formatCookieBannerMessage(
                  router.locale || "en",
                  "monitoringCategory",
                )}
              </h3>
              <div className="w-full py-5 px-6 bg-background shadow-box flex justify-around items-center">
                <SentryIcon />
                <div className="flex flex-col ml-8">
                  <h4 className="font-medium text-m">Sentry</h4>
                  <p className="text-s mt-2 text-gray-darker">
                    {formatCookieBannerMessage(
                      router.locale || "en",
                      "sentryDescription",
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex">
              <Button
                type="button"
                className="btn btn-cookie-ghost"
                onPress={async () => {
                  await fetchJson("/api/consent-cookie/", "PATCH", {
                    sentry: false,
                  }).then(() => {
                    setIsModalOpen(false);
                  });
                }}
              >
                {formatCookieBannerMessage(router.locale || "en", "refuse")}
              </Button>
              <Button
                type="button"
                className="btn btn-cookie-primary"
                onPress={async () => {
                  await fetchJson("/api/consent-cookie/", "PATCH", {
                    sentry: true,
                  }).then(() => {
                    setIsModalOpen(false);
                  });
                }}
              >
                {formatCookieBannerMessage(router.locale || "en", "accept")}
              </Button>
            </div>
          </div>
          <ModalOverlay className="lg:hidden" />
        </>
      ) : null}
    </div>
  );
};

export { CookieBanner };
