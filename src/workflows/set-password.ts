import { PasswordRules } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/http-verbs";
import { ErrorSettingPassword } from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";

type SetPasswordOutput = {
  restrictionRulesError?: PasswordRules;
};

async function setPassword(passwordInput: string): Promise<SetPasswordOutput> {
  return fetchJson("/api/auth-connect/set-password", HttpVerbs.POST, {
    passwordInput,
  }).then((response) => {
    if (response.status >= 400 && response.status !== 422) {
      throw new ErrorSettingPassword();
    }

    return response.json();
  });
}

export type { SetPasswordOutput };
export { setPassword };
