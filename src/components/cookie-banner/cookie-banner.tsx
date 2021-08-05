import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { CookieButton, ButtonVariant, StyledButton } from "../buttons/buttons";
import { SentryIcon } from "../icons/sentry-logo/sentry-icon";
import { InputSwitch } from "../input/input-switch";
import { formatCookieBannerMessage } from "@src/configs/intl";

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
        <CookieModal>
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
                onChange={(_e) => setIsSentryAuthorized(!isSentryAuthorized)}
              />
              <ServiceDesc>
                {formatCookieBannerMessage(
                  router.locale || "en",
                  "sentryDescription",
                )}
              </ServiceDesc>
            </FlexContainer>
          </Card>

          <ButtonsWrapper>
            <CookieButtons type="button" variant={ButtonVariant.GHOST}>
              {formatCookieBannerMessage(router.locale || "en", "refuseAll")}
            </CookieButtons>
            <CookieButtons type="button" variant={ButtonVariant.PRIMARY}>
              {formatCookieBannerMessage(router.locale || "en", "acceptAll")}
            </CookieButtons>
          </ButtonsWrapper>
        </CookieModal>
      ) : (
        <></>
      )}
    </CookieBannerWrapper>
  );
};

const CookieBannerWrapper = styled.div`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
`;

const CookieModal = styled.div`
  width: 42rem;
  min-height: 32rem;
  position: absolute;
  bottom: 5rem;
  left: 2rem;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.box};
  border-radius: ${({ theme }) => theme.radii[0]};
  padding: ${({ theme }) => theme.spaces.xs} ${({ theme }) => theme.spaces.xs} 0;
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.h1};
  margin-bottom: 1.25rem;
`;

const ModalTextContent = styled.p`
  line-height: 1.25;
  margin-bottom: 1.5rem;
`;

const CategoryTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.h2};
  margin-bottom: 1rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const CookieButtons = styled(StyledButton)`
  margin-bottom: 0;
  ${({ theme, variant }) =>
    variant === ButtonVariant.PRIMARY &&
    `
      border-radius: 0 0 ${theme.radii[0]} 0;
      `};

  ${({ theme, variant }) =>
    variant === ButtonVariant.GHOST &&
    `
    color: ${theme.colors.primary};
    border-radius: 0 0 0 ${theme.radii[0]};
    border-top: 0.1rem solid ${theme.colors.separator}
      `};
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
`;

export { CookieBanner };
