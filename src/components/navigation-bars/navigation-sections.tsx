import React from "react";

import { HomeIcon } from "../icons/home-icon/home-icon";
import { KeyIcon } from "../icons/key-icon/key-icon";
import { LockIcon } from "../icons/lock-icon/lock-icon";
import { UserIcon } from "../icons/user-icon/user-icon";
import { LoginsIcon } from "@src/components/icons/logins-icon/logins-icon";
import { ProfileIcon } from "@src/components/icons/profile-icon/profile-icon";
import { SecurityIcon } from "@src/components/icons/security-icon/security-icon";

function getNavigationSections(
  isNewProfile: boolean,
): [string, { href: string; icon: Element }][] {
  const navigationSections = {
    home: {
      href: "/account",
      icon: <HomeIcon />,
    },
    logins: {
      href: "/account/logins",
      icon: <KeyIcon />,
    },
    security: {
      href: "/account/security",
      icon: <LockIcon />,
    },
  };

  const profileSection = isNewProfile
    ? {
        createYourProfile: {
          href: "/account/profile/user-profile/new",
          icon: <UserIcon />,
        },
      }
    : {
        personalInformation: {
          href: "/account/profile",
          icon: <UserIcon />,
        },
      };

  const { home, logins, security } = navigationSections;

  return Object.entries({
    home,
    ...profileSection,
    logins,
    security,
  }) as unknown as [string, { href: string; icon: Element }][];
}

function getSectionListContent(
  isNewProfile: boolean,
): [string, { textID: string; icon: Element }][] {
  const partialListContent = {
    loginsTitle: {
      textID: "logins",
      icon: <LoginsIcon />,
    },
    securityTitle: {
      textID: "security",
      icon: <SecurityIcon />,
    },
  };

  const profileSection = isNewProfile
    ? {
        createProfileTitle: {
          textID: "createProfile",
          icon: <ProfileIcon />,
        },
      }
    : {
        updateProfileTitle: {
          textID: "updateProfile",
          icon: <ProfileIcon />,
        },
      };

  return Object.entries({
    ...profileSection,
    ...partialListContent,
  }) as unknown as [string, { textID: string; icon: Element }][];
}

export { getNavigationSections, getSectionListContent };
