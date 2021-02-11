import { getIdentities } from "@fewlines/connect-management";

import { config } from "@src/config";

async function isMarkingIdentityAsPrimaryAuthorized(
  sub: string,
  identityId: string,
): Promise<boolean> {
  const identities = await getIdentities(config.managementCredentials, sub);

  return identities
    ? identities.some((identity) => identity.id === identityId)
    : false;
}

export { isMarkingIdentityAsPrimaryAuthorized };
