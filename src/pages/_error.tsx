import React from "react";
import styled from "styled-components";

type ErrorPageProps = {
  error: Error;
  statusCode: number;
  isReadyToRender: boolean;
  children?: React.ReactElement;
};

const Error: React.FC<ErrorPageProps> = () => {
  return (
    <Wrapper>
      <h2>
        Something went wrong. We are working on getting this fixed as soon as we
        can.
      </h2>
    </Wrapper>
  );
};

export default Error;

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
