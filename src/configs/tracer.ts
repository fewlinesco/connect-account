import { getTracer, startTracer, Tracer } from "@fwl/tracing";

import { configVariables } from "@src/configs/config-variables";

const options = configVariables.lightstepAccessToken
  ? {
      lightstepPublicSatelliteCollector: {
        serviceName: configVariables.serviceName,
        accessToken: configVariables.lightstepAccessToken,
      },
    }
  : {
      simpleCollector: {
        serviceName: configVariables.serviceName,
        url: "http://localhost:55681/v1/traces",
      },
    };

startTracer(options);

export default function (): Tracer {
  return getTracer();
}
