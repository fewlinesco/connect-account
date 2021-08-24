import React from "react";

import { ErrorFallbackComponent } from "@src/components/error-fallback-component";

const Custom404Component: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center">
      <ErrorFallbackComponent statusCode={404} />
    </div>
  );
};

export default Custom404Component;
