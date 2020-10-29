import { Identity, IdentityTypes } from "@lib/@types";
import type { ProviderUser } from "@lib/@types/ProviderUser";
import type { SortedIdentities } from "@src/@types/SortedIdentities";

function getIdentityType(type: string): IdentityTypes {
  switch (type.toUpperCase()) {
    case "APPLE":
      return IdentityTypes.APPLE;
    case "FACEBOOK":
      return IdentityTypes.FACEBOOK;
    case "GITHUB":
      return IdentityTypes.GITHUB;
    case "GOOGLE":
      return IdentityTypes.GOOGLE;
    case "KAKAO_TALK":
      return IdentityTypes.KAKAO_TALK;
    case "LINE":
      return IdentityTypes.LINE;
    case "NAVER":
      return IdentityTypes.NAVER;
    case "PAYPAL":
      return IdentityTypes.PAYPAL;
    case "STRAVA":
      return IdentityTypes.STRAVA;
    case "VKONTAKTE":
      return IdentityTypes.VKONTAKTE;
    case "MICROSOFT":
      return IdentityTypes.MICROSOFT;
    default:
      throw new Error(`Can't deal with identity type ${type}`);
  }
}

export function sortIdentities(fetchedData: {
  data?: { provider: ProviderUser } | null;
}): SortedIdentities {
  const phoneIdentities: Identity[] = [];
  const emailIdentities: Identity[] = [];
  const socialIdentities: Identity[] = [];

  if (fetchedData.data) {
    const identities: Identity[] = fetchedData.data.provider.user.identities;

    identities.forEach((identity) => {
      const identityPattern = {
        id: identity.id,
        primary: identity.primary,
        status: identity.status,
        value: identity.value,
      };
      const identityType = identity.type.toUpperCase();
      if (identityType === IdentityTypes.EMAIL) {
        emailIdentities.push({
          ...identityPattern,
          type: IdentityTypes.EMAIL,
        });
      } else if (identityType === IdentityTypes.PHONE) {
        phoneIdentities.push({
          ...identityPattern,
          type: IdentityTypes.PHONE,
        });
      } else if (identityType !== IdentityTypes.PROVIDER) {
        socialIdentities.push({
          ...identityPattern,
          type: getIdentityType(identity.type),
        });
      }
    });
  }

  function sortPrimary(a: Identity, b: Identity): number {
    return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
  }

  phoneIdentities.sort(sortPrimary);
  emailIdentities.sort(sortPrimary);
  socialIdentities.sort(sortPrimary);

  return { phoneIdentities, emailIdentities, socialIdentities };
}
