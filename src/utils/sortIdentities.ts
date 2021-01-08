import { getIdentityType } from "./getIdentityType";
import { Identity, IdentityTypes } from "@lib/@types";
import type { SortedIdentities } from "@src/@types/sorted-identities";
import { UnhandledIdentityType } from "@src/clientErrors";

function sortPrimaryIdentity(a: Identity, b: Identity): number {
  return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
}

function sortIdentitiyStatus(a: Identity, b: Identity): number {
  return a.status === b.status ? 0 : a.status === "validated" ? -1 : 1;
}

export function sortIdentities(identities: Identity[]): SortedIdentities {
  const phoneIdentities: Identity[] = [];
  const emailIdentities: Identity[] = [];
  const socialIdentities: Identity[] = [];

  identities.forEach((identity) => {
    try {
      const identityPattern = {
        id: identity.id,
        primary: identity.primary,
        status: identity.status,
        value: identity.value,
      };

      if (getIdentityType(identity.type) === IdentityTypes.EMAIL) {
        emailIdentities.push({
          ...identityPattern,
          type: IdentityTypes.EMAIL,
        });
      } else if (getIdentityType(identity.type) === IdentityTypes.PHONE) {
        phoneIdentities.push({
          ...identityPattern,
          type: IdentityTypes.PHONE,
        });
      } else if (getIdentityType(identity.type) !== IdentityTypes.PROVIDER) {
        socialIdentities.push({
          ...identityPattern,
          type: getIdentityType(identity.type),
        });
      }
    } catch (error) {
      if (error instanceof UnhandledIdentityType) {
        return;
      } else {
        throw error;
      }
    }
  });

  phoneIdentities.sort(sortIdentitiyStatus).sort(sortPrimaryIdentity);
  emailIdentities.sort(sortIdentitiyStatus).sort(sortPrimaryIdentity);
  socialIdentities.sort(sortIdentitiyStatus).sort(sortPrimaryIdentity);

  return { phoneIdentities, emailIdentities, socialIdentities };
}
