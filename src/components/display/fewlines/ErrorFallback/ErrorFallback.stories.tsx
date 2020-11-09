import React from "react";

import { Container } from "../Container";
import { ErrorFallback } from "./ErrorFallback";

export default {
  title: "components/Error fallback component",
  component: ErrorFallback,
};

export const StandardErrorFallback = (): JSX.Element => {
  return (
    <Container>
      <ErrorFallback statusCode={504} />
    </Container>
  );
};
