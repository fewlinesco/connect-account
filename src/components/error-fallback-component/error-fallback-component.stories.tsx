import React from "react";

import { Container } from "../containers/container";
import { ErrorFallbackComponent } from "./error-fallback-component";

const StandardErrorFallback = (): JSX.Element => {
  return (
    <Container>
      <ErrorFallbackComponent statusCode={504} />
    </Container>
  );
};

export { StandardErrorFallback };
export default {
  title: "components/Error Fallback Component",
  component: ErrorFallbackComponent,
};
