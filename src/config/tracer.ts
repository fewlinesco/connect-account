import { getTracer, startTracer, Tracer } from "@fwl/tracing";

import { config } from "@src/config";

const options = config.lightstepAccessToken
  ? {
      lightstepPublicSatelliteCollector: {
        serviceName: config.serviceName,
        accessToken: config.lightstepAccessToken,
      },
    }
  : {
      simpleCollector: {
        serviceName: config.serviceName,
        url: "http://localhost:55681/v1/traces",
      },
    };

startTracer(options);

export default function (): Tracer {
  return getTracer();
}
