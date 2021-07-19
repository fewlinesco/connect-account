// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6baf0213093a428d9e9ec7ae0979868c@o287463.ingest.sentry.io/5387583",
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  environment:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  enabled:
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === "development"
      ? false
      : process.env.NODE_ENV === "production",
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
