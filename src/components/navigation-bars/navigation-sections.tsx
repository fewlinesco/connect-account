import React from "react";

import { HomeIcon } from "../icons/home-icon/home-icon";
import { KeyIcon } from "../icons/key-icon/key-icon";
import { LockIcon } from "../icons/lock-icon/lock-icon";
import { UserIcon } from "../icons/user-icon/user-icon";

const NAVIGATION_SECTIONS = {
  Home: {
    href: "/account",
    icon: <HomeIcon />,
  },
  Personal_Information: {
    href: "/account/profile",
    icon: <UserIcon />,
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

export { NAVIGATION_SECTIONS };
