import { getIdentities } from "@lib/queries/getIdentities";
import { NoIdentityFound } from "@src/clientErrors";
import { GraphqlErrors } from "@src/errors";

export async function isMarkingIdentityAsPrimaryAuthorized(
  sub: string,
  identityId: string,
): Promise<boolean> {
  const identities = await getIdentities(sub).then(({ errors, data }) => {
    if (errors) {
      throw new GraphqlErrors(errors);
    }

    if (!data) {
      throw new NoIdentityFound();
    }

    return data.provider.user.identities;
  });

  return identities
    ? identities.some((identity) => identity.id === identityId)
    : false;
}
