import { Identity } from "@fewlines/connect-management";
import React from "react";
import { useIntl } from "react-intl";
import useSWR from "swr";

import { SendTwoFACodeForm } from "@src/components/forms/send-two-fa-code-form";
import { VerifyTwoFACodeForm } from "@src/components/forms/verify-two-fa-code-form";
import { LockIcon } from "@src/components/icons/lock-icon";
import { Separator } from "@src/components/separator";

const TwoFA: React.FC = () => {
  const [isCodeSent, setIsCodeSent] = React.useState<boolean>(false);

  const { data: primaryIdentities, error } = useSWR<Identity[], Error>(
    "/api/identities?primary=true/",
  );

  if (error) {
    throw error;
  }

  const { formatMessage } = useIntl();

  return (
    <div className="font-normal leading-10 bg-box px-8 py-12 lg:px-24 lg:py-16 rounded ">
      <div className="flex items-center text-red mb-8">
        <LockIcon />
        <p className="leading-9 ml-8">{formatMessage({ id: "warning" })}</p>
      </div>
      <Separator />
      <SendTwoFACodeForm
        isCodeSent={isCodeSent}
        setIsCodeSent={setIsCodeSent}
        identities={primaryIdentities}
      />
      {isCodeSent ? (
        <>
          <Separator />
          <VerifyTwoFACodeForm setIsCodeSent={setIsCodeSent} />
        </>
      ) : null}
    </div>
  );
};

export { TwoFA };
