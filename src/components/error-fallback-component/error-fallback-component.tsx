import React from "react";
import styled from "styled-components";

import { NeutralLink } from "../neutral-link/neutral-link";

type ErrorFallbackComponentProps = {
  statusCode: number;
};

export const ErrorFallbackComponent: React.FC<ErrorFallbackComponentProps> = ({
  statusCode,
}) => {
  return (
    <Wrapper statusCode={statusCode}>
      {statusCode === 404 ? (
        <>
          <h1>We can&apos;t find the page you are looking for.</h1>
          <p>
            It may have expired, or there could be a typo. Maybe you can find
            what you need on our <NeutralLink href="/">homepage</NeutralLink>.
          </p>
        </>
      ) : (
        <h2>
          Something went wrong. We are working on getting this fixed as soon as
          we can.
        </h2>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ statusCode: number }>`
  width: 100%;
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: ${({ theme }) => theme.spaces.xs};
  margin-top: ${({ statusCode, theme }) =>
    statusCode !== 404 ? theme.spaces.s : ""};
`;
