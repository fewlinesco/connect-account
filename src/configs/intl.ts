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

function formatAlertMessage(locale: string, id: string): string {
  switch (locale) {
    case "fr":
      return frIntl.formatMessage({ id });
    case "en":
      return enIntl.formatMessage({ id });
    default:
      throw new Error(
        `${locale} locale not allowed. Please choose one of the following:\nen\nfr`,
      );
  }
}

function getLocaleFromRequest(request: NextApiRequest, span: Span): string {
  let locale = request.cookies["NEXT_LOCALE"] || "en";

  if (locale[0] === '"') {
    locale = locale.slice(1, -1);
  }

  span.setDisclosedAttribute("locale", locale);
  return locale;
}

export { formatAlertMessage, getLocaleFromRequest };
