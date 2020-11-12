import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { HomeDesktopBackground } from "../Icons/HomeDesktopBackground/HomeDesktopBackground";
import { HomeMobileBackground } from "../Icons/HomeMobileBackground/HomeMobileBackground";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { deviceBreakpoints } from "@src/design-system/theme";

type HomeProps = { authorizeURL: string; providerName: string };

export const Home: React.FC<HomeProps> = ({ authorizeURL, providerName }) => {
  return (
    <>
      <HomeDesktopBackground />
      <HomeMobileBackground />
      <Wrapper>
        <Container>
          <ShadowBox>
            <Flex>
              <DescriptionText>
                You are about to access your account from {providerName}
              </DescriptionText>
              <Link href={authorizeURL} passHref>
                <a>
                  <Button variant={ButtonVariant.PRIMARY}>
                    Access my account
                  </Button>
                </a>
              </Link>
            </Flex>
          </ShadowBox>
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
  z-index: 2;

  @media ${deviceBreakpoints.m} {
    width: 80%;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spaces.xs} ${({ theme }) => theme.spaces.s};
`;

const DescriptionText = styled.p`
  text-align: center;
  margin: ${({ theme }) => theme.spaces.xs} 0;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

export const BackLink = styled.p`
  text-align: center;
  margin: ${({ theme }) => theme.spaces.xs} 0;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;
