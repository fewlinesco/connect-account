import React from "react";

const Box: React.FC = ({ children }) => {
  return <div className="bg-box mb-8 p-8">{children}</div>;
};
export { Box };
