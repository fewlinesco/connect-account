import { SentryIcon } from "@src/components/icons/sentry-icon";

type ServiceToConsent = {
  name: string;
  descriptionId: string;
  icon: JSX.Element;
};

const servicesToConsentByCategory: Record<string, ServiceToConsent[]> = {
  monitoring: [
    {
      name: "Sentry",
      descriptionId: "sentryDescription",
      icon: <SentryIcon />,
    },
    {
      name: "Sentry",
      descriptionId: "sentryDescription",
      icon: <SentryIcon />,
    },
  ],
  analytics: [
    {
      name: "Sentry",
      descriptionId: "sentryDescription",
      icon: <SentryIcon />,
    },
  ],
};

export { servicesToConsentByCategory };
