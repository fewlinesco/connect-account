import React from "react";

import { ErrorFallbackComponent } from "./error-fallback-component";

const StandardErrorFallback = (): JSX.Element => {
  return (
    <div className="container mb-40 lg:mb-0">
      <ErrorFallbackComponent statusCode={504} />
    </div>
  );
};

export { StandardErrorFallback };
export default {
  title: "components/Error Fallback Component",
  component: ErrorFallbackComponent,
};
