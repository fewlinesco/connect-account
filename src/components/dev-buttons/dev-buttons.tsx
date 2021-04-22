import Link from "next/link";
import React from "react";
import styled from "styled-components";

import { generateAlertMessage } from "@src/utils/generateAlertMessage";

const AddAlertMessage: React.FC = () => {
  const cookiesList = encodeURIComponent(
    JSON.stringify([
      generateAlertMessage("This is an alert message"),
      generateAlertMessage("This is another alert message"),
    ]),
  );

  return (
    <DevButton
      onClick={() => {
        document.cookie = `alert-messages=${cookiesList}; max-age=3600; path=/;`;
      }}
    >
      Add alert messages
    </DevButton>
  );
};

const Navigation: React.FC = () => {
  return (
    <DevButton>
      <Link href="/">
        <a>/</a>
      </Link>
    </DevButton>
  );
};

const DevButtons: React.FC = () => {
  return (
    <DevSection>
      <AddAlertMessage />
      <Navigation />
    </DevSection>
  );
};

const DevSection = styled.div`
  position: fixed;
  left: 2rem;
  bottom: 2rem;
`;

const DevButton = styled.button`
  padding: 1rem 2rem;
  margin: 0 1rem;
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
`;

export { DevButtons };
