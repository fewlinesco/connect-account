import React from "react";
import styled from "styled-components";

import { CookieButton, ButtonVariant, StyledButton } from "../buttons/buttons";
import { SentryIcon } from "../icons/sentry-logo/sentry-icon";
import { InputSwitch } from "../input/input-switch";

const CookieBanner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(true);
  const [isSentryAuthorized, setIsSentryAuthorized] =
    React.useState<boolean>(true);
  const [isAllServicesAuthorized, setIsAllServicesAuthorized] =
    React.useState<boolean>(true);

  return (
    <CookieBannerWrapper>
      <CookieButton onPress={() => setIsModalOpen(!isModalOpen)} />
      {isModalOpen ? (
        <CookieModal>
          <ModalTitle>Cookies</ModalTitle>
          <ModalTextContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            bibendum arcu vel neque sagittis, eu laoreet diam dapibus. Ut id
            lectus nec ante maximus mollis nec id nulla.
          </ModalTextContent>
          <CategoryTitle>Monitoring</CategoryTitle>
          <ToggleAllWrapper>
            <InputSwitch
              groupName="overallPref"
              labelText="Toggle all"
              isSelected={isAllServicesAuthorized}
              onChange={(_e) => {
                setIsAllServicesAuthorized(!isAllServicesAuthorized);
                setIsSentryAuthorized(!isAllServicesAuthorized);
              }}
            />
          </ToggleAllWrapper>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                bibendum arcu vel neque sagittis
              </ServiceDesc>
            </FlexContainer>
          </Card>

          <ButtonsWrapper>
            <CookieButtons type="button" variant={ButtonVariant.GHOST}>
              Refuse all
            </CookieButtons>
            <CookieButtons type="button" variant={ButtonVariant.PRIMARY}>
              Accept all
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
  height: 34rem;
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

const ToggleAllWrapper = styled.div`
  padding: 1rem 1.5rem 1rem 0;
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
  margin-left: 1rem;
`;

const ServiceDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.lightGrey};
  width: 85%;
  margin-top: 0.2rem;
`;

export { CookieBanner };
