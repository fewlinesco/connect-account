import { PasswordRules } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/core/http-verbs";
import { ErrorSettingPassword } from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";

export type SetPasswordOutput = {
  restrictionRulesError?: PasswordRules;
};

export async function setPassword(
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
