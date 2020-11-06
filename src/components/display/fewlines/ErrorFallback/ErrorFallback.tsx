import Link from "next/link";
import React from "react";
import styled from "styled-components";

type ErrorFallbackProps = {
  statusCode: number;
};

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ statusCode }) => {
  return (
    <Wrapper>
      {statusCode === 404 ? (
        <>
          <h2>We can&apos;t find the page you are looking for.</h2>
          <p>
            It may have expired, or there could be a typo. Maybe you can find
            what you need on our{" "}
            <Link href="/">
              <a>homepage</a>
            </Link>
            .
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

const Wrapper = styled.div`
  width: 100%;
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: ${({ theme }) => theme.spaces.xs};
  p {
    font-size: ${({ theme }) => theme.fontSizes.l};
  }
`;
