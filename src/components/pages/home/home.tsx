import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { ButtonVariant } from "@src/components/buttons/buttons";
import { FakeButton } from "@src/components/buttons/fake-button";
import { HomeDesktopBackground } from "@src/components/icons/home-desktop-background/home-desktop-background";
import { HomeMobileBackground } from "@src/components/icons/home-mobile-background/home-mobile-background";
import { NeutralLink } from "@src/components/neutral-link/neutral-link";
import { SectionBox } from "@src/components/shadow-box/section-box";
import { deviceBreakpoints } from "@src/design-system/theme";

const Home: React.FC<{ authorizeURL: string; providerName: string }> = ({
  authorizeURL,
  providerName,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <HomeDesktopBackground />
      <HomeMobileBackground />
      <Wrapper>
        <Container>
          <SectionBox>
            <Flex>
              <DescriptionText>
                {formatMessage({ id: "info" })} {providerName}
              </DescriptionText>
              <NeutralLink href={authorizeURL}>
                <FakeButton variant={ButtonVariant.PRIMARY}>
                  {formatMessage({ id: "callToAction" })}
                </FakeButton>
              </NeutralLink>
            </Flex>
          </SectionBox>
        </Container>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${deviceBreakpoints.m} {
    top: 7rem;
    align-items: flex-start;
  }
`;

const Container = styled.div`
  max-width: 40rem;

  @media ${deviceBreakpoints.m} {
    width: 80%;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spaces.s};

  div {
    margin: 0;
  }
`;

const DescriptionText = styled.p`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spaces.xs} 0;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export { Home };
