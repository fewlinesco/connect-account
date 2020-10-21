import React from "react";

import { SetPasswordError } from "@lib/@types/Password";
import { User } from "@lib/@types/ProviderUser";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { ErrorSettingPassword } from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";

interface SetPasswordProps {
  children: (props: {
    setPassword: (passwordInput: string) => Promise<SetPasswordOutput>;
  }) => JSX.Element;
}

export type SetPasswordOutput = {
  data: { createOrUpdatePassword: User };
  restrictionRulesError?: SetPasswordError;
};

export const SetPassword: React.FC<SetPasswordProps> = ({ children }) => {
  async function setPassword(
    passwordInput: string,
  ): Promise<SetPasswordOutput> {
    return fetchJson("/api/auth-connect/set-password", HttpVerbs.POST, {
      passwordInput,
    }).then((response) => {
      if (response.status >= 400 && response.status !== 422) {
        throw new ErrorSettingPassword();
      }

      return response.json();
    });
  }

  return children({
    setPassword,
  });
};
