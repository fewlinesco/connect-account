import React from "react";

import { HomeIcon } from "../icons/home-icon";
import { KeyIcon } from "../icons/key-icon";
import { LockIcon } from "../icons/lock-icon";
import { UserIcon } from "../icons/user-icon";
import { LoginsIcon } from "@src/components/icons/logins-icon";
import { ProfileIcon } from "@src/components/icons/profile-icon";
import { SecurityIcon } from "@src/components/icons/security-icon";

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
    updateProfileTitle: {
      textID: "updateProfile",
      icon: <ProfileIcon />,
    },
    loginsTitle: {
      textID: "logins",
      icon: <LoginsIcon />,
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
