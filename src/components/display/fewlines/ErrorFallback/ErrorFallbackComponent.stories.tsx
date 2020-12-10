import React from "react";

import { Container } from "../Container";
import { ErrorFallbackComponent } from "./ErrorFallbackComponent";

export default {
  title: "components/Error Fallback Component",
  component: ErrorFallbackComponent,
};

export const StandardErrorFallback = (): JSX.Element => {
  return (
    <Container>
      <ErrorFallbackComponent statusCode={504} />
    </Container>
  );
};
