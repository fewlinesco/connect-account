import React from "react";

import { AwaitingValidationIcon } from "./icons/awaiting-validation-icon";
import { PrimaryIcon } from "./icons/primary-icon";

const PrimaryBadge: React.FC<{ localizedLabel: string }> = ({
  localizedLabel,
}) => {
  return (
    <div className="flex justify-center items-center bg-primary rounded-full text-background mb-4 h-10 w-36">
      <div className="text-s mr-2">{localizedLabel}</div>
      <PrimaryIcon />
    </div>
  );
};

const AwaitingValidationBadge: React.FC<{ localizedLabel: string }> = ({
  localizedLabel,
}) => {
  return (
    <div className="flex justify-center items-center bg-red rounded-full h-10 w-64 mb-4">
      <div className="text-s mr-2">{localizedLabel}</div>
      <AwaitingValidationIcon />
    </div>
  );
};

export { PrimaryBadge, AwaitingValidationBadge };
