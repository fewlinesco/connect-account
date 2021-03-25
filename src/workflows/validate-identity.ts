import { HttpVerbs } from "@src/@types/http-verbs";
import { InvalidValidationCode, TemporaryIdentityExpired } from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";
import { ERRORS_DATA } from "@src/web-errors";

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

      if (
        code === ERRORS_DATA.INVALID_VALIDATION_CODE.code ||
        code === ERRORS_DATA.INVALID_BODY.code
      ) {
        throw new InvalidValidationCode("Invalid validation code");
      }

      if (code === ERRORS_DATA.TEMPORARY_IDENTITY_EXPIRED.code) {
        throw new TemporaryIdentityExpired();
      }
    }

    const path = new URL(response.url).pathname;

    return path;
  });
}

export { validateIdentity };
