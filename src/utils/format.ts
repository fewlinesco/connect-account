import { Address } from "@src/@types/profile";

function capitalizeFirstLetter(word: string): string {
  const normalizedWord = word.toLocaleLowerCase();
  return normalizedWord.charAt(0).toLocaleUpperCase() + normalizedWord.slice(1);
}

function formatKakaoTalk(word: string): string {
  return word
    .split("_")
    .map((item) => item.charAt(0) + item.toLocaleLowerCase().slice(1))
    .join("");
}

function formatVKontakte(word: string): string {
  return word.slice(0, 2) + word.slice(2).toLocaleLowerCase();
}

function formatSpecialSocialIdentities(
  word: "KAKAO_TALK" | "VKONTAKTE",
): string {
  if (word === "KAKAO_TALK") {
    return formatKakaoTalk(word);
  }

  if (word === "VKONTAKTE") {
    return formatVKontakte(word);
  }

  throw new Error("Wrong social identity");
}

function formatStreetAddressToDisplay(address: Address): string {
  return address.street_address_2
    ? `${address.street_address}, ${address.street_address_2}`
    : address.street_address;
}

function formatOtherAddressFieldsToDisplay(address: Address): string {
  const otherFields = [];

  if (address.postal_code) {
    otherFields.push(address.postal_code);
  }

  if (address.locality) {
    otherFields.push(address.locality);
  }

  if (address.region) {
    otherFields.push(address.region);
  }

  if (address.country) {
    otherFields.push(address.country);
  }

  return otherFields.join(", ");
}

export {
  capitalizeFirstLetter,
  formatSpecialSocialIdentities,
  formatStreetAddressToDisplay,
  formatOtherAddressFieldsToDisplay,
};
