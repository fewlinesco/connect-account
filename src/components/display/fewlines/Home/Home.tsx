import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { HomeDesktopBackground } from "../Icons/HomeDesktopBackground/HomeDesktopBackground";
import { HomeMobileBackground } from "../Icons/HomeMobileBackground/HomeMobileBackground";
import { ShadowBox } from "../ShadowBox/ShadowBox";
import { deviceBreakpoints } from "@src/design-system/theme/lightTheme";

type HomeProps = { authorizeURL: string };

export const Home: React.FC<HomeProps> = ({ authorizeURL }) => {
  const router = useRouter();
  return (
    <>
      <HomeDesktopBackground />
      <HomeMobileBackground />
      <Wrapper>
        <Container>
          <ShadowBox>
            <Flex>
              <DescriptionText>
                You are about to access your account from fewlines.co
              </DescriptionText>
              <Link href={authorizeURL}>
                <Button variant={ButtonVariant.PRIMARY}>
                  Access my account
                </Button>
              </Link>
              <BackLink onClick={() => router.push("http://fewlines.co")}>
                Go back to fewlines.co
              </BackLink>
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
