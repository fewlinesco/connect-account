import { createIntl, createIntlCache } from "@formatjs/intl";

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

function formatAlertMessage(locale: "en" | "fr", id: string): string {
  if (locale === "fr") {
    return frIntl.formatMessage({ id });
  }

  return enIntl.formatMessage({ id });
}

export { formatAlertMessage };
