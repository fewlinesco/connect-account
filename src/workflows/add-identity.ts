import { Identity } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/http-verbs";
import { InMemoryTemporaryIdentity } from "@src/@types/temporary-identity";
import { fetchJson } from "@src/utils/fetch-json";

async function addIdentity(
  identityInput: InMemoryTemporaryIdentity,
  identityToUpdateId?: Identity["id"],
): Promise<{ eventId: string } | { code: string; message: string }> {
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
    return response.json();
  });
}

export { addIdentity };
