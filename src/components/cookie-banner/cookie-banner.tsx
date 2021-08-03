import React from "react";
import styled from "styled-components";

import { CookieButton } from "../buttons/buttons";

const CookieBanner: React.FC = () => {
  const [isBannerOpen, setIsBannerOpen] = React.useState<boolean>(true);
  return (
    <CookieBannerWrapper>
      <CookieButton onPress={() => setIsBannerOpen(!isBannerOpen)} />
      {isBannerOpen ? <CookieModal>hello</CookieModal> : <></>}
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
  position: absolute;
  top: -3rem;
  left: 2rem;
`;

export { CookieBanner };
