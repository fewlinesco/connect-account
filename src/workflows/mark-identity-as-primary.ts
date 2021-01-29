import { Identity } from "@fewlines/connect-management";

import { HttpVerbs } from "@src/@types/core/http-verbs";
import { fetchJson } from "@src/utils/fetch-json";

export async function markIdentityAsPrimaryCall(
  identityId: Identity["id"],
): Promise<Response> {
  const body = {
    identityId,
  };

  return fetchJson(
    "/api/auth-connect/mark-identity-as-primary",
    HttpVerbs.POST,
    body,
  ).catch((error) => {
    throw error;
  });
}
