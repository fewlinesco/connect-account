import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { CookieButton, Button } from "./buttons";
import { SentryIcon } from "./icons/sentry-icon";
import { ModalOverlay } from "./modal-overlay";
import { formatCookieBannerMessage } from "@src/configs/intl";
import { deviceBreakpoints } from "@src/design-system/theme";
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
    <CookieBannerWrapper>
      <CookieButton
        onPress={() => setIsModalOpen(!isModalOpen)}
        isOpen={isModalOpen}
      />
      {isModalOpen ? (
        <>
          <CookieModal>
            <Content>
              <ModalTitle>Cookies</ModalTitle>
              <ModalTextContent>
                {formatCookieBannerMessage(
                  router.locale || "en",
                  "generalDescription",
                )}
              </ModalTextContent>
              <CategoryTitle>
                {formatCookieBannerMessage(
                  router.locale || "en",
                  "monitoringCategory",
                )}
              </CategoryTitle>
              <Card>
                <SentryIcon />
                <FlexContainer>
                  <ServiceName>Sentry</ServiceName>
                  <ServiceDesc>
                    {formatCookieBannerMessage(
                      router.locale || "en",
                      "sentryDescription",
                    )}
                  </ServiceDesc>
                </FlexContainer>
              </Card>
            </Content>
            <ButtonsWrapper>
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
            </ButtonsWrapper>
          </CookieModal>
          <ModalOverlay className="lg:hidden" />
        </>
      ) : null}
    </CookieBannerWrapper>
  );
};

const CookieBannerWrapper = styled.div`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  z-index: 20;

  @media ${deviceBreakpoints.m} {
    bottom: 0;
    left: 0;
    width: 100%;
  }
`;

const CookieModal = styled.div`
  width: 42rem;
  position: absolute;
  bottom: 5rem;
  left: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.box};
  border-radius: ${({ theme }) => theme.radii[0]};
  z-index: 20;

  @media ${deviceBreakpoints.m} {
    bottom: 0;
    left: 0;
    width: 100%;
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spaces.xs} ${({ theme }) => theme.spaces.xs} 0;
  margin-bottom: 1.25rem;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.h1};
  margin-bottom: 1.25rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.black};
`;

const ModalTextContent = styled.p`
  line-height: 1.25;
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: 1.25rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const Card = styled.div`
  width: 100%;
  padding: 1.25rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.box};
  display: flex;
  justify-content: space-around;

  svg {
    flex-shrink: 0;
    align-self: center;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
`;

const ServiceName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.s};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ServiceDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.breadcrumbs};
  margin-top: 0.4rem;
`;

export { CookieBanner };
