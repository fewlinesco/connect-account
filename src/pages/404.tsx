import React from "react";
import styled from "styled-components";

import { ErrorFallback } from "@src/components/display/fewlines/ErrorFallback/ErrorFallback";

const Custom404: React.FC = () => {
  return (
    <CustomLayout>
      <ErrorFallback statusCode={404} />
    </CustomLayout>
  );
};

export default Custom404;

const CustomLayout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;
