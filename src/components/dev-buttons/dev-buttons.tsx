import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { generateAlertMessage } from "@src/utils/generateAlertMessage";

const DevButtonAddAlertMessage: React.FC = () => {
  const cookiesList = encodeURIComponent(
    JSON.stringify([
      generateAlertMessage("This is an alert message"),
      generateAlertMessage("This is an alert message"),
    ]),
  );

  return (
    <DevButton
      onClick={() => {
        document.cookie = `alert-messages=${cookiesList}; max-age=3600; path=/;`;
      }}
    >
      Add alert message
    </DevButton>
  );
};

const DevButtons: React.FC = () => {
  const router = useRouter();

  return (
    <DevSection>
      <DevButtonAddAlertMessage />
      <DevButton
        onClick={() => {
          router && router.push("/account/security/sudo");
        }}
      >
        Go to sudo page
      </DevButton>
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
  background-color: ${({ theme }) => theme.colors.boxShadow};
  cursor: pointer;
`;

export { DevButtons };
