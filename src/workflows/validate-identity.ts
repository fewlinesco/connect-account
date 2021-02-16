import { HttpVerbs } from "@src/@types/http-verbs";
import { InvalidValidationCode, TemporaryIdentityExpired } from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";

async function validateIdentity(
  validationCode: string,
  eventId: string,
): Promise<string> {
  return fetchJson("/api/auth-connect/verify-validation-code", HttpVerbs.POST, {
    validationCode,
    eventId,
  }).then(async (response) => {
    if (response.status >= 400) {
      const { code } = await response.json();

      if (code === "invalid_validation_code") {
        throw new InvalidValidationCode("Invalid validation code");
      }

      if (code === "temporary_identity_expired") {
        throw new TemporaryIdentityExpired();
      }
    }

    const path = new URL(response.url).pathname;

    return path;
  });
}

export { validateIdentity };
