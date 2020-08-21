import Link from "next/link";
import React from "react";
import styled from "styled-components";

const Custom404: React.FC = () => {
  return (
    <Wrapper>
      <h2>We can&apos;t find the page you are looking for.</h2>
      <p>
        It may have expired, or there could be a typo. Maybe you can find what
        you need on our{" "}
        <Link href="/">
          <a>homepage</a>
        </Link>
        .
      </p>
    </Wrapper>
  );
};

export default Custom404;

const Wrapper = styled.div`
  width: 100rem;
  min-height: 15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii[1]};
  background-color: ${({ theme }) => theme.colors.backgroundContrast};
  box-shadow: ${({ theme }) => theme.shadows.base};

  p {
    font-size: ${({ theme }) => theme.fontSizes.l};
  }
`;
