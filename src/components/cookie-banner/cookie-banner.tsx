import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { CookieButton, ButtonVariant, Button } from "../buttons/buttons";
import { ClickAwayListener } from "../click-away-listener";
import { SentryIcon } from "../icons/sentry-logo/sentry-icon";
import { InputSwitch } from "../input/input-switch";
import { formatCookieBannerMessage } from "@src/configs/intl";
import { deviceBreakpoints } from "@src/design-system/theme";

const CookieBanner: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(true);
  const [isSentryAuthorized, setIsSentryAuthorized] =
    React.useState<boolean>(true);
  // const [isAllServicesAuthorized, setIsAllServicesAuthorized] =
  //   React.useState<boolean>(true);

  return (
    <CookieBannerWrapper>
      <CookieButton onPress={() => setIsModalOpen(!isModalOpen)} />
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
              {/* <ToggleAllWrapper>
            <InputSwitch
              groupName="overallPref"
              labelText={formatCookieBannerMessage(
                router.locale || "en",
                "toggle",
              )}
              isSelected={isAllServicesAuthorized}
              onChange={(_e) => {
                setIsAllServicesAuthorized(!isAllServicesAuthorized);
                setIsSentryAuthorized(!isAllServicesAuthorized);
              }}
            />
          </ToggleAllWrapper> */}
              <Card>
                <SentryIcon />
                <FlexContainer>
                  <InputSwitch
                    groupName="monitoringPref"
                    labelText="Sentry"
                    isSelected={isSentryAuthorized}
                    onChange={(_e) =>
                      setIsSentryAuthorized(!isSentryAuthorized)
                    }
                  />
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
                variant={ButtonVariant.GHOST_COOKIE}
                onPress={() => setIsModalOpen(false)}
              >
                {formatCookieBannerMessage(router.locale || "en", "refuseAll")}
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.PRIMARY_COOKIE}
                onPress={() => {
                  console.log("hello");
                  setIsModalOpen(false);
                }}
              >
                {formatCookieBannerMessage(router.locale || "en", "acceptAll")}
              </Button>
            </ButtonsWrapper>
          </CookieModal>
          <Overlay />
        </>
      ) : null}
    </CookieBannerWrapper>
  );
};

const CookieBannerWrapper = styled.div`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
  z-index: 3;

  @media ${deviceBreakpoints.m} {
    bottom: 0;
    left: 0;
    width: 100%;
  }
`;

const Overlay = styled(ClickAwayListener)`
  display: none;

  @media ${deviceBreakpoints.m} {
    display: block;
    background-color: rgba(0, 0, 0, 0.1);
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
  z-index: 2;

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
`;

const ModalTextContent = styled.p`
  line-height: 1.25;
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.h2};
  margin-bottom: 1.25rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

// const ToggleAllWrapper = styled.div`
//   padding: 1rem 1.5rem 1rem 0;
// `;

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
  margin-left: 1rem;
`;

const ServiceDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.lightGrey};
  width: 85%;
  margin-top: 0.2rem;

  @media ${deviceBreakpoints.m} {
    width: 80%;
  }
`;

export { CookieBanner };
