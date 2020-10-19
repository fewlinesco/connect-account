import React from "react";

import { Container } from "../Container";
import { H1 } from "../H1/H1";
import { H2 } from "../H2/H2";
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

const Account: React.FC = () => {
  return (
    <Container>
      <H1>Welcome to your account</H1>
      <H2>First name last name</H2>
      {Object.entries(SECTION_LIST_CONTENT).map(([sectionName, content]) => {
        return (
          <SectionListItem
            key={sectionName}
            sectionName={sectionName}
            content={content}
          />
        );
      })}
    </Container>
  );
};

export default Account;
