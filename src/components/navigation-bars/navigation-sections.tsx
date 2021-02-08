import React from "react";

import { HomeIcon } from "../icons/home-icon/home-icon";
import { KeyIcon } from "../icons/key-icon/key-icon";
import { LockIcon } from "../icons/lock-icon/lock-icon";

export const NAVIGATION_SECTIONS = {
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
