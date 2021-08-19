import React from "react";

const SectionBox: React.FC = ({ children }) => {
  return (
    <div className="bg-background mb-4 rounded shadow-box">{children}</div>
  );
};

export { SectionBox };
