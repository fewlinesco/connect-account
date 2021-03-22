import { AlertMessage } from "@fwl/web";
import React from "react";

type AlertMessagesContextDataStructure = {
  alertMessages: AlertMessage[];
  setAlertMessages: React.Dispatch<React.SetStateAction<AlertMessage[]>>;
};

const AlertMessagesContext = React.createContext<
  AlertMessagesContextDataStructure | undefined
>(undefined);

const AlertMessageProvider: React.FC<{
  children: React.ReactNode | undefined;
}> = ({ children }) => {
  const [alertMessages, setAlertMessages] = React.useState<AlertMessage[]>([]);

  return (
    <AlertMessagesContext.Provider value={{ alertMessages, setAlertMessages }}>
      {children}
    </AlertMessagesContext.Provider>
  );
};

function useAlertMessages(): AlertMessagesContextDataStructure {
  const context = React.useContext(AlertMessagesContext);

  if (context === undefined) {
    throw new Error(
      "useAlertMessages must be used within a AlertMessageProvider",
    );
  }

  return context;
}

export { AlertMessageProvider, useAlertMessages, AlertMessagesContext };
