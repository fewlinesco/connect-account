import React from "react";
import ReactDOM from "react-dom";

const AlertMessagesPortal: React.FC = ({ children }) => {
  const [isDOMLoaded, setIsDOMLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsDOMLoaded(true);
  }, []);

  if (!isDOMLoaded) {
    return null;
  }

  return ReactDOM.createPortal(children, document.body);
};

export { AlertMessagesPortal };
