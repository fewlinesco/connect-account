import Link from "next/link";
import React from "react";

import { generateAlertMessage } from "@src/utils/generate-alert-message";

const DevButton: React.FC<{ onClick?: () => void }> = ({
  onClick,
  children,
}) => {
  return (
    <button
      className="rounded bg-secondary cursor-pointer mx-4 py-4 px-8"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

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
    <div className="fixed right-8 bottom-8">
      <AddAlertMessage />
      <Navigation />
    </div>
  );
};

export { DevButtons };
