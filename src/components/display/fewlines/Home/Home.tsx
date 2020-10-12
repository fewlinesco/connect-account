import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { HomeBackground } from "../HomeBackground/HomeBackground";
import { ShadowBox } from "../ShadowBox/ShadowBox";

type HomeProps = { authorizeURL: string };

const Home: React.FC<HomeProps> = ({ authorizeURL }) => {
  const router = useRouter();
  return (
    <>
      <HomeBackground />
      <Wrapper>
        <Container>
          <ShadowBox>
            <Flex>
              <DescriptionText>
                You are about to access your account from fewlines.co
              </DescriptionText>
              <Button
                variant={ButtonVariant.PRIMARY}
                onClick={() => router.push(authorizeURL)}
              >
                Access my account
              </Button>
              <BackLink>Go back to fewlines.co</BackLink>
            </Flex>
          </ShadowBox>
        </Container>
      </Wrapper>
    </>
  );
};

export default Home;

const Wrapper = styled.div`
  position: absolute;
  top: 7rem;
  left: 0;
  width: 100%;
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  z-index: 2;
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

const BackLink = styled.p`
  text-align: center;
  margin: ${({ theme }) => theme.spaces.xs} 0;
  color: ${({ theme }) => theme.colors.primary};
`;
