import React from "react";

import { CreateOrUpdatePassword } from "@lib/commands/createOrUpdatePassword";
import { HttpVerbs } from "@src/@types/HttpVerbs";
import { ErrorSettingPassword } from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";

interface SetPasswordProps {
  children: (props: {
    setPassword: (passwordInput: string) => Promise<CreateOrUpdatePassword>;
  }) => JSX.Element;
}

export const SetPassword: React.FC<SetPasswordProps> = ({ children }) => {
  async function setPassword(
    passwordInput: string,
  ): Promise<CreateOrUpdatePassword> {
    return fetchJson("/api/auth-connect/set-password", HttpVerbs.POST, {
      passwordInput,
    }).then((response) => {
      if (response.status >= 400) {
        throw new ErrorSettingPassword();
      }

      return response.json();
    });
  }

  return children({
    setPassword,
  });
};
