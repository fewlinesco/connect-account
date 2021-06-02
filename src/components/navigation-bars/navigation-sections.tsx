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
    Home: {
      href: "/account",
      icon: <HomeIcon />,
    },
    Logins: {
      href: "/account/logins",
      icon: <KeyIcon />,
    },
    Security: {
      href: "/account/security",
      icon: <LockIcon />,
    },
  };

  const profileSection = isNewProfile
    ? {
        Create_Your_Profile: {
          href: "/account/profile/user-profile/new",
          icon: <UserIcon />,
        },
      }
    : {
        Personal_Information: {
          href: "/account/profile",
          icon: <UserIcon />,
        },
      };

  const { Home, Logins, Security } = navigationSections;

  return Object.entries({
    Home,
    ...profileSection,
    Logins,
    Security,
  }) as unknown as [string, { href: string; icon: Element }][];
}

function getSectionListContent(
  isNewProfile: boolean,
): [string, { text: string; icon: Element }][] {
  const partialListContent = {
    LOGINS: {
      text: "Manage your logins options, including emails, phone numbers and social logins",
      icon: <LoginsIcon />,
    },
    SECURITY: {
      text: "Set or change your password. You can check your connections history here",
      icon: <SecurityIcon />,
    },
  };

  const profileSection = isNewProfile
    ? {
        CREATE_YOUR_PROFILE: {
          text: "Add basic information about you, like your name, or addresses.",
          icon: <ProfileIcon />,
        },
      }
    : {
        PERSONAL_INFORMATION: {
          text: "Update basic information about you, like your name, or addresses.",
          icon: <ProfileIcon />,
        },
      };

  return Object.entries({
    ...profileSection,
    ...partialListContent,
  }) as unknown as [string, { text: string; icon: Element }][];
}

export { getNavigationSections, getSectionListContent };
