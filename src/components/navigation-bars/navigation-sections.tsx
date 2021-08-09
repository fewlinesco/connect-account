import React from "react";

import { HomeIcon } from "../icons/home-icon/home-icon";
import { KeyIcon } from "../icons/key-icon/key-icon";
import { LockIcon } from "../icons/lock-icon/lock-icon";
import { UserIcon } from "../icons/user-icon/user-icon";
import { LoginsIcon } from "@src/components/icons/logins-icon/logins-icon";
import { ProfileIcon } from "@src/components/icons/profile-icon/profile-icon";
import { SecurityIcon } from "@src/components/icons/security-icon/security-icon";

function getNavigationSections(): [string, { href: string; icon: Element }][] {
  const NAVIGATION_SECTIONS = {
    home: {
      href: "/account/",
      icon: <HomeIcon />,
    },
    personalInformation: {
      href: "/account/profile/",
      icon: <UserIcon />,
    },
    logins: {
      href: "/account/logins/",
      icon: <KeyIcon />,
    },
    security: {
      href: "/account/security/",
      icon: <LockIcon />,
    },
  };

  return Object.entries(NAVIGATION_SECTIONS) as unknown as [
    string,
    { href: string; icon: Element },
  ][];
}

function getSectionListContent(): [
  string,
  { textID: string; icon: Element },
][] {
  const SECTION_LIST_CONTENT = {
    loginsTitle: {
      textID: "logins",
      icon: <LoginsIcon />,
    },
    updateProfileTitle: {
      textID: "updateProfile",
      icon: <ProfileIcon />,
    },
    securityTitle: {
      textID: "security",
      icon: <SecurityIcon />,
    },
  };

  return Object.entries(SECTION_LIST_CONTENT) as unknown as [
    string,
    { textID: string; icon: Element },
  ][];
}

export { getNavigationSections, getSectionListContent };
