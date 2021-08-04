import React from "react";
import styled from "styled-components";

import { CookieButton } from "../buttons/buttons";

const CookieBanner: React.FC = () => {
  const [isBannerOpen, setIsBannerOpen] = React.useState<boolean>(true);
  return (
    <CookieBannerWrapper>
      <CookieButton onPress={() => setIsBannerOpen(!isBannerOpen)} />
      {isBannerOpen ? (
        <CookieModal>
          <ModalTitle>Cookies</ModalTitle>
          <ModalTextContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
            bibendum arcu vel neque sagittis, eu laoreet diam dapibus. Ut id
            lectus nec ante maximus mollis nec id nulla.{" "}
          </ModalTextContent>
          <CategoryTitle>Monitoring</CategoryTitle>
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
  height: 39rem;
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

export { CookieBanner };
