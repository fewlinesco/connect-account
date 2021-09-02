import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { CookieButton, Button } from "./buttons";
import { InputSwitch } from "./input/input-switch/input-switch";
import { ModalOverlay } from "./modal-overlay";
import { servicesToConsentByCategory } from "@content/services-to-consent";
import { formatCookieBannerMessage } from "@src/configs/intl";
import { SWRError } from "@src/errors/errors";
import { fetchJson } from "@src/utils/fetch-json";

async function setUserConsentCookie(
  cookieValue: Record<string, boolean>,
): Promise<void> {
  return fetchJson(`/api/consent-cookie`, "PATCH", cookieValue).then(() => {
    document.location.reload();
  });
}

const CookieBanner: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isAllServicesAuthorized, setIsAllServicesAuthorized] =
    React.useState<boolean>(true);

  const initialServicesStatus = Object.values(servicesToConsentByCategory)
    .flat()
    .reduce((acc, key) => ({ ...acc, [key.name.toLowerCase()]: true }), {});

  const [servicesStatus, setServicesStatus] = React.useState<
    Record<string, boolean>
  >(initialServicesStatus);

  const { data: consentCookie } = useSWR<Record<string, string>, SWRError>(
    `/api/consent-cookie/`,
    { refreshInterval: 0 },
  );

  const multipleServices = Object.values(servicesToConsentByCategory).some(
    (servicesArray, _index, originalArray) =>
      servicesArray.length > 1 || originalArray.length > 1,
  );

  React.useEffect(() => {
    if (consentCookie) {
      if (!consentCookie.isSet) {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);

        const servicesConsent: Record<string, boolean> = JSON.parse(
          consentCookie.content,
        );

        for (const [key, value] of Object.entries(servicesConsent)) {
          setServicesStatus((servicesStatus) => {
            return {
              ...servicesStatus,
              [key]: value,
            };
          });
        }
      }
    }
  }, [consentCookie]);

  return (
    <div className="fixed w-full lg:w-px bottom-0 left-0 lg:left-8 lg:bottom-8 z-20">
      <CookieButton
        onPress={() => setIsModalOpen(!isModalOpen)}
        isOpen={isModalOpen}
      />
      {isModalOpen ? (
        <>
          <div className="w-full lg:w-max lg:max-w-2xl absolute bottom-0 left-0 lg:bottom-20 lg:left-8 bg-background shadow-box rounded z-20 overflow-y-auto">
            <div className="pt-8 pb-6 px-8 max-h-192 overflow-y-auto">
              <h2 className="text-xxl text-black mb-5 font-normal">Cookies</h2>
              <p className="leading-tight mb-6">
                {formatCookieBannerMessage(
                  router.locale || "en",
                  "generalDescription",
                )}
              </p>
              {multipleServices ? (
                <div className="pb-6">
                  <InputSwitch
                    groupName="overallPref"
                    labelText={formatCookieBannerMessage(
                      router.locale || "en",
                      "toggle",
                    )}
                    isSelected={isAllServicesAuthorized}
                    onChange={(_event) => {
                      setIsAllServicesAuthorized(!isAllServicesAuthorized);
                    }}
                  />
                </div>
              ) : null}

              {Object.entries(servicesToConsentByCategory).map(
                ([categoryName, services], index) => {
                  return (
                    <React.Fragment key={categoryName + index}>
                      <h4
                        className={`font-medium mb-6 ${
                          index === 0 ? "mt-0" : "mt-5"
                        }`}
                      >
                        {formatCookieBannerMessage(
                          router.locale || "en",
                          categoryName,
                        )}
                      </h4>
                      {services.map(({ name, descriptionId, icon }, index) => {
                        console.log(servicesStatus[name.toLocaleLowerCase()]);
                        return (
                          <div
                            key={name + index}
                            className="w-full py-5 px-6 bg-background shadow-box flex justify-around items-center"
                          >
                            {icon}
                            <div className="flex flex-col ml-8">
                              {multipleServices ? (
                                <InputSwitch
                                  groupName="services"
                                  labelText={name}
                                  isSelected={
                                    servicesStatus[name.toLocaleLowerCase()]
                                      ? true
                                      : false
                                  }
                                  onChange={(_event) => {
                                    setServicesStatus({
                                      ...servicesStatus,
                                      [name.toLowerCase()]:
                                        !servicesStatus[name.toLowerCase()],
                                    });
                                  }}
                                  className="font-medium text-m"
                                />
                              ) : (
                                <h5 className="font-medium text-m">{name}</h5>
                              )}

                              <p className="text-s mt-2 text-gray-darker">
                                {formatCookieBannerMessage(
                                  router.locale || "en",
                                  descriptionId,
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                },
              )}
            </div>
            <div className="flex">
              <Button
                type="button"
                className="btn btn-cookie-ghost"
                onPress={async () => {
                  await setUserConsentCookie({ sentry: false });
                }}
              >
                {formatCookieBannerMessage(
                  router.locale || "en",
                  multipleServices ? "refuseAll" : "refuse",
                )}
              </Button>
              <Button
                type="button"
                className="btn btn-cookie-primary"
                onPress={async () => {
                  await setUserConsentCookie({ sentry: true });
                }}
              >
                {formatCookieBannerMessage(
                  router.locale || "en",
                  multipleServices ? "acceptAll" : "accept",
                )}
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
