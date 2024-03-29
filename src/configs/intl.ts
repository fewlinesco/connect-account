import { createIntl, createIntlCache } from "@formatjs/intl";
import { Span } from "@fwl/tracing";
import { NextApiRequest } from "next";

import * as locales from "@content/locales";

const cache = createIntlCache();
const enIntl = createIntl(
  {
    locale: "en",
    messages: { ...locales["en"].alertMessages },
  },
  cache,
);
const frIntl = createIntl(
  {
    locale: "fr",
    messages: { ...locales["fr"].alertMessages },
  },
  cache,
);
const enNavIntl = createIntl(
  {
    locale: "en",
    messages: { ...locales["en"].navigation },
  },
  cache,
);
const frNavIntl = createIntl(
  {
    locale: "fr",
    messages: { ...locales["fr"].navigation },
  },
  cache,
);
const enErrorIntl = createIntl(
  {
    locale: "en",
    messages: { ...locales["en"].errors },
  },
  cache,
);
const frErrorIntl = createIntl(
  {
    locale: "fr",
    messages: { ...locales["fr"].errors },
  },
  cache,
);

const enCookieIntl = createIntl(
  {
    locale: "en",
    messages: { ...locales["en"].cookieBanner },
  },
  cache,
);

const frCookieIntl = createIntl(
  {
    locale: "fr",
    messages: { ...locales["fr"].cookieBanner },
  },
  cache,
);

function formatAlertMessage(locale: string, id: string): string {
  switch (locale) {
    case "fr":
      return frIntl.formatMessage({ id });
    case "en":
      return enIntl.formatMessage({ id });
    default:
      throw new Error(
        `${locale} locale not allowed. Please choose one of the following:\n- en\n- fr`,
      );
  }
}

function formatNavigation(locale: string, id: string): string {
  switch (locale) {
    case "fr":
      return frNavIntl.formatMessage({ id });
    case "en":
      return enNavIntl.formatMessage({ id });
    default:
      throw new Error(
        `${locale} locale not allowed. Please choose one of the following:\n- en\n- fr`,
      );
  }
}

function formatErrorMessage(
  locale: string,
  id: string,
  variables?: Record<string, unknown>,
): string {
  switch (locale) {
    case "fr":
      return frErrorIntl.formatMessage({ id }, variables);
    case "en":
      return enErrorIntl.formatMessage({ id }, variables);
    default:
      throw new Error(
        `${locale} locale not allowed. Please choose one of the following:\n- en\n- fr`,
      );
  }
}

function formatCookieBannerMessage(locale: string, id: string): string {
  switch (locale) {
    case "fr":
      return frCookieIntl.formatMessage({ id });
    case "en":
      return enCookieIntl.formatMessage({ id });
    default:
      throw new Error(
        `${locale} locale not allowed. Please choose one of the following:\n- en\n- fr`,
      );
  }
}

function getLocaleFromRequest(request: NextApiRequest, span: Span): string {
  if (!request.headers["accept-language"]) {
    const locale = request.cookies["NEXT_LOCALE"] || "en";
    span.setDisclosedAttribute("locale", locale);
    return locale;
  }

  const acceptLanguage = request.headers["accept-language"]
    .split(",")
    .map((locale) => locale.split("-")[0])
    .map((locale) => locale.split(";")[0]);

  const filteredAcceptLanguage = acceptLanguage.find(
    (locale) => locale === "en" || locale === "fr",
  );

  const locale =
    request.cookies["NEXT_LOCALE"] || filteredAcceptLanguage || "en";
  span.setDisclosedAttribute("locale", locale);
  return locale;
}

export {
  formatAlertMessage,
  getLocaleFromRequest,
  formatNavigation,
  formatErrorMessage,
  formatCookieBannerMessage,
};
