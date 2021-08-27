// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { WebError } from "@fwl/web/dist/errors";
import * as Sentry from "@sentry/nextjs";

const sentryUserConsent = document.cookie
  ? document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("user-consent"))
      .split("=")[1]
  : undefined;

const parsedSentryUserConsent = sentryUserConsent
  ? JSON.parse(decodeURIComponent(sentryUserConsent)).sentry
  : false;

if (parsedSentryUserConsent) {
  Sentry.init({
    dsn: "https://6baf0213093a428d9e9ec7ae0979868c@o287463.ingest.sentry.io/5387583",
    tracesSampleRate: 1.0,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    enabled:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === "development"
        ? false
        : process.env.NODE_ENV === "production",
    beforeSend(event, hint) {
      if (hint.originalException instanceof WebError) {
        return null;
      }

      return event;
    },
  });
}
