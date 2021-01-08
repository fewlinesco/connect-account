import { getIdentities } from "@lib/queries/get-identities";
import { NoDataReturned, NoIdentityFound } from "@src/clientErrors";
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
      throw new NoDataReturned();
    }

    const identities = data.provider.user.identities;

    if (!identities) {
      throw new NoIdentityFound();
    }

    return identities;
  });

  return identities
    ? identities.some((identity) => identity.id === identityId)
    : false;
}
