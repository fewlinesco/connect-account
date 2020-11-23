export type Application = {
  id: string;
  name: string;
  description: string;
  defaultHomePage: string;
  redirectUris: string[];
};

export type ApplicationInput = {
  id: string;
  description: string;
  name: string;
  redirectUris: string[];
  defaultHomePage: string;
};

export type ProviderApplication = {
  application: Application;
};
