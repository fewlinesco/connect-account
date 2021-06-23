function getNavSectionHref(sectionName: string): string {
  switch (sectionName) {
    case "updateProfileTitle":
      return "/account/profile";
    case "createProfileTitle":
      return "/account/profile/user-profile/new";
    case "loginsTitle":
      return "/account/logins";
    case "securityTitle":
      return "/account/security";
    default:
      throw new Error(
        `${sectionName} key not allowed. Please choose one from the locale hash.`,
      );
  }
}

export { getNavSectionHref };
