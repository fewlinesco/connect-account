import React from "react";
import styled from "styled-components";

import { Button, ButtonVariant } from "../Button/Button";
import { ShadowBox } from "../ShadowBox/ShadowBox";

type HomeProps = { authorizeURL: string };

const Home: React.FC<HomeProps> = ({ authorizeURL }) => {
  return (
    <Container>
      <ShadowBox>
        <Flex>
          <DescriptionText>
            You are about to access your account from fewlines.co
          </DescriptionText>
          <a href={authorizeURL}>
            <Button variant={ButtonVariant.PRIMARY}>Access my account</Button>
          </a>
          <BackLink>Go back to fewlines.co</BackLink>
        </Flex>
      </ShadowBox>
    </Container>
  );
};

export default Home;

export const Container = styled.div`
  max-width: 80%;
  margin: 0 auto;
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
