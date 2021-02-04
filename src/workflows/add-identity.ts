import { IdentityTypes } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/http-verbs";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import {
  ErrorSendingValidationCode,
  PhoneNumberInputValueShouldBeANumber,
} from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";
import { getIdentityType } from "@src/utils/get-identity-type";

export async function addIdentity(
  identityInput: InMemoryTemporaryIdentity,
): Promise<{ eventId: string; errorMessage?: string }> {
  const body = {
    callbackUrl: "/",
    identityInput,
  };

  return fetchJson(
    "/api/auth-connect/send-identity-validation-code",
    HttpVerbs.POST,
    body,
  ).then(async (response) => {
    if (response.status > 400) {
      throw new ErrorSendingValidationCode();
    }

    if (getIdentityType(identityInput.type) === IdentityTypes.PHONE) {
      try {
        JSON.parse(identityInput.value);
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new PhoneNumberInputValueShouldBeANumber(
            "Phone identity value should be a number",
          );
        }

        throw error;
      }
    }

    return response.json();
  });
}
