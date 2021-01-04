import type { SetPasswordError } from "@lib/@types/Password";
import type { User } from "@lib/@types/ProviderUser";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import { ErrorSettingPassword } from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";

export type SetPasswordOutput = {
  data: { createOrUpdatePassword: User };
  restrictionRulesError?: SetPasswordError;
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
