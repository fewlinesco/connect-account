import { HttpVerbs } from "@src/@types/core/http-verbs";
import {
  InvalidValidationCode,
  TemporaryIdentityExpired,
} from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetch-json";

export async function validateIdentity(
  validationCode: string,
  eventId: string,
): Promise<string> {
  return fetchJson("/api/auth-connect/verify-validation-code", HttpVerbs.POST, {
    validationCode,
    eventId,
  }).then(async (response) => {
    if (response.status >= 400) {
      const { error } = await response.json();

      if (error === "INVALID") {
        throw new InvalidValidationCode("Invalid validation code");
      }

      if (error === "Temporary Identity Expired") {
        throw new TemporaryIdentityExpired();
      }
    }

    const path = new URL(response.url).pathname;

    return path;
  });
}
