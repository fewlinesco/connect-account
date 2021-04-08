import React from "react";
import styled from "styled-components";

import { NeutralLink } from "../neutral-link/neutral-link";

const ErrorFallbackComponent: React.FC<{
  statusCode: number;
}> = ({ statusCode }) => {
  return (
    <Wrapper statusCode={statusCode}>
      {statusCode === 404 ? (
        <>
          <h1>We can&apos;t find the page you are looking for.</h1>
          <p>
            It may have expired, or there could be a typo. Maybe you can find
            what you need on our <HomepageLink href="/">homepage</HomepageLink>.
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

const HomepageLink = styled(NeutralLink)`
  color: ${({ theme }) => theme.colors.primary};
`;

export { ErrorFallbackComponent };
