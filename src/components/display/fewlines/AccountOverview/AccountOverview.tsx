import React from "react";

import { LoginsIcon } from "../Icons/LoginsIcon/LoginsIcon";
import { SecurityIcon } from "../Icons/SecurityIcon/SecurityIcon";
import { SectionListItem } from "../SectionListItem/SectionListItem";

export const SECTION_LIST_CONTENT = {
  LOGINS: {
    text:
      "Manage your logins options, including emails, phone numbers and social logins",
    icon: <LoginsIcon />,
  },
  SECURITY: {
    text:
      "Set or change your password. You can check your connections history here",
    icon: <SecurityIcon />,
  },
};

export const AccountOverview: React.FC = () => {
  return (
    <>
      {Object.entries(SECTION_LIST_CONTENT).map(([sectionName, content]) => {
        return (
          <SectionListItem
            key={sectionName}
            sectionName={sectionName}
            content={content}
          />
        );
      })}
    </>
  );
};
