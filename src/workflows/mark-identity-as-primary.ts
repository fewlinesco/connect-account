import { Identity } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/http-verbs";
import { fetchJson } from "@src/utils/fetch-json";

async function markIdentityAsPrimaryCall(
  identityId: Identity["id"],
): Promise<Response> {
  const body = {
    identityId,
  };

  return fetchJson(
    "/api/auth-connect/mark-identity-as-primary",
    HttpVerbs.POST,
    body,
  );
}

export { markIdentityAsPrimaryCall };
