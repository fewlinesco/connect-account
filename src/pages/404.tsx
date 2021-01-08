import React from "react";
import styled from "styled-components";

import { ErrorFallbackComponent } from "@src/components/error-fallback-component/error-fallback-component";

const Custom404Component: React.FC = () => {
  return (
    <CustomLayout>
      <ErrorFallbackComponent statusCode={404} />
    </CustomLayout>
  );
};

export default Custom404Component;

const CustomLayout = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
`;
