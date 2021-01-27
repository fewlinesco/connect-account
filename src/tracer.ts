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
        url: "http://localhost:9411/api/v2/spans",
      },
    };

startTracer(options);

export default function (): Tracer {
  return getTracer();
}
