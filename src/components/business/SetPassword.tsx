import { useRouter } from "next/router";
import React from "react";

import { HttpVerbs } from "@src/@types/HttpVerbs";
import { ErrorSettingPassword } from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";

interface SetPasswordProps {
  children: (props: {
    setPassword: (passwordInput: string) => Promise<void>;
  }) => JSX.Element;
}

export const SetPassword: React.FC<SetPasswordProps> = ({ children }) => {
  const router = useRouter();

  async function setPassword(passwordInput: string): Promise<void> {
    try {
      const response = await fetchJson(
        "/api/auth-connect/set-password",
        HttpVerbs.POST,
        { passwordInput },
      );

      if (response.status >= 400) {
        throw new ErrorSettingPassword();
      }
      router && router.push(`/account/logins/`);
    } catch (error) {
      router && router.push("/account/logins/email/new");
    }
  }

  return children({
    setPassword,
  });
};
