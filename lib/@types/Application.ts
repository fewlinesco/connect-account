export type Application = {
  id: string;
  name: string;
  description: string;
  defaultHomePage: string;
  redirectUris: string[];
};

export type ProviderApplication = {
  application: Application;
};
