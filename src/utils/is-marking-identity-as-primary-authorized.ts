import { getIdentities } from "@fewlines/connect-management";

import { CONFIG_VARIABLES } from "@src/configs/config-variables";

async function isMarkingIdentityAsPrimaryAuthorized(
  sub: string,
  identityId: string,
): Promise<boolean> {
  const identities = await getIdentities(
    CONFIG_VARIABLES.managementCredentials,
    sub,
  );

  return identities
    ? identities.some((identity) => identity.id === identityId)
    : false;
}

export { isMarkingIdentityAsPrimaryAuthorized };
