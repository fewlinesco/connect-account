import { Identity } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/http-verbs";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { ErrorSendingValidationCode } from "@src/errors";
import { fetchJson } from "@src/utils/fetch-json";

async function addIdentity(
  identityInput: InMemoryTemporaryIdentity,
  identityToUpdateId?: Identity["id"],
): Promise<{ eventId: string; errorMessage?: string }> {
  const body = {
    callbackUrl: "/",
    identityInput,
    identityToUpdateId,
  };

  return fetchJson(
    "/api/auth-connect/send-identity-validation-code",
    HttpVerbs.POST,
    body,
  ).then(async (response) => {
    if (response.status > 400) {
      throw new ErrorSendingValidationCode();
    }

    return response.json();
  });
}

export { addIdentity };
