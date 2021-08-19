import React from "react";

const Box: React.FC = ({ children }) => {
  return <div className="bg-box mb-8 p-8">{children}</div>;
};

const SectionBox: React.FC<{ className?: string }> = ({
  className,
  children,
}) => {
  return (
    <div className={"bg-background mb-4 rounded shadow-box " + className}>
      {children}
    </div>
  );
};

export { Box, SectionBox };
