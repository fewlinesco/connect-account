import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const DevButtonAddAlertMessage: React.FC = () => {
  const cookiesList = encodeURIComponent(
    JSON.stringify([
      {
        id: uuidv4(),
        text: "This is an alert message",
        expiresAt: Date.now() + 300000,
      },
      {
        id: uuidv4(),
        text: "This is an alert message",
        expiresAt: Date.now() + 300000,
      },
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
  return (
    <DevSection>
      <DevButtonAddAlertMessage />
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
  border-radius: ${({ theme }) => theme.radii[0]};
  background-color: ${({ theme }) => theme.colors.boxShadow};
  cursor: pointer;
`;

export { DevButtons };
