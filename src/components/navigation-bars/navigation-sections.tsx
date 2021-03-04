import React from "react";

import { HomeIcon } from "../icons/home-icon/home-icon";
import { KeyIcon } from "../icons/key-icon/key-icon";
import { LockIcon } from "../icons/lock-icon/lock-icon";

const NAVIGATION_SECTIONS = {
  Home: {
    href: "/account",
    icon: <HomeIcon />,
  },
  Logins: {
    href: "/account/logins",
    icon: <KeyIcon />,
  },
  TestHybrid: {
    href: "/account/logins/test",
    icon: <KeyIcon />,
  },
  TestFullSWR: {
    href: "/account/logins/test-no-gssp",
    icon: <KeyIcon />,
  },
  Security: {
    href: "/account/security",
    icon: <LockIcon />,
  },
};

export { NAVIGATION_SECTIONS };
