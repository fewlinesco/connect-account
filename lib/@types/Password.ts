export type ProviderUserPasswordSet = {
  id: string;
  name: string;
  user: {
    id: string;
    passwords: {
      available: boolean;
    };
  };
};

export type SetPasswordErrorRules = {
  min_digits: {
    error: boolean;
    minimum: number;
  };
  min_non_digits: {
    error: boolean;
    minimum: number;
  };
  min_total_characters: {
    error: boolean;
    minimum: number;
  };
};

export type SetPasswordError = {
  code: string;
  locations: [
    {
      column: number;
      line: number;
    },
  ];
  message: string;
  path: string[];
  rules: SetPasswordErrorRules;
};
