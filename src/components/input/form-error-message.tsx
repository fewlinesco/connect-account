import React from "react";

const FormErrorMessage: React.FC = ({ children }) => {
  return <p className="text-red mb-8">{children}</p>;
};

export { FormErrorMessage };
