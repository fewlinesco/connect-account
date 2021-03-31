import { getIdentities } from "@fewlines/connect-management";

import { configVariables } from "@src/configs/config-variables";

async function isMarkingIdentityAsPrimaryAuthorized(
  sub: string,
  identityId: string,
): Promise<boolean> {
  const identities = await getIdentities(
    configVariables.managementCredentials,
    sub,
  );

  return identities
    ? identities.some((identity) => identity.id === identityId)
    : false;
}

export { isMarkingIdentityAsPrimaryAuthorized };
