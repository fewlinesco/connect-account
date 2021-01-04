import { IdentityTypes } from "@lib/@types";
import { InMemoryTemporaryIdentity } from "@src/@types/TemporaryIdentity";
import { HttpVerbs } from "@src/@types/core/HttpVerbs";
import {
  ErrorSendingValidationCode,
  IdentityAlreadyUsed,
  IdentityInputValueCantBeBlank,
  PhoneNumberInputValueShouldBeANumber,
} from "@src/clientErrors";
import { fetchJson } from "@src/utils/fetchJson";
import { getIdentityType } from "@src/utils/getIdentityType";

export async function addIdentity(
  identityInput: InMemoryTemporaryIdentity,
): Promise<string> {
  const body = {
    callbackUrl: "/",
    identityInput,
  };

  return fetchJson(
    "/api/auth-connect/send-identity-validation-code",
    HttpVerbs.POST,
    body,
  ).then(async (response) => {
    const { data, error } = await response.json();

    if (response.status >= 400) {
      if (error === "identity_already_validated") {
        throw new IdentityAlreadyUsed(
          "Identity has already been validated by a user",
        );
      }

      if (error === "can't be blank") {
        throw new IdentityInputValueCantBeBlank(
          "Identity value can't be blank",
        );
      }

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

    return data;
  });
}
