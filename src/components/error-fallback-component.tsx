import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { NeutralLink } from "./neutral-link";
import { formatErrorMessage } from "@src/configs/intl";

const ErrorFallbackComponent: React.FC<{
  statusCode: number;
}> = ({ statusCode }) => {
  const { locale } = useRouter();

  return (
    <Wrapper statusCode={statusCode}>
      {statusCode === 404 ? (
        <>
          <h1>{formatErrorMessage(locale || "en", "404Title")}</h1>
          <p>
            {formatErrorMessage(locale || "en", "404Content")}{" "}
            <HomepageLink href="/account/">
              {formatErrorMessage(locale || "en", "homepage")}
            </HomepageLink>
            .
          </p>
        </>
      ) : (
        <h3>{formatErrorMessage(locale || "en", "500Content")}</h3>
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
  text-align: center;
  margin-top: ${({ statusCode, theme }) =>
    statusCode !== 404 ? theme.spaces.s : ""};
`;

const HomepageLink = styled(NeutralLink)`
  color: ${({ theme }) => theme.colors.primary};
`;

export { ErrorFallbackComponent };
