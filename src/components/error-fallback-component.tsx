import { useRouter } from "next/router";
import React from "react";

import { NeutralLink } from "./neutral-link";
import { formatErrorMessage } from "@src/configs/intl";

const ErrorFallbackComponent: React.FC<{
  statusCode: number;
}> = ({ statusCode }) => {
  const { locale } = useRouter();

  return (
    <div
      className={`${
        statusCode !== 404 ? "mt-16" : ""
      } w-full h-60 flex flex-col justify-around rounded bg-background shadow-base text-center p-8`}
    >
      {statusCode === 404 ? (
        <>
          <h1>{formatErrorMessage(locale || "en", "404Title")}</h1>
          <p>
            {formatErrorMessage(locale || "en", "404Content")}{" "}
            <NeutralLink className="text-primary" href="/account/">
              {formatErrorMessage(locale || "en", "homepage")}
            </NeutralLink>
            .
          </p>
        </>
      ) : (
        <h3 className="mb-0">
          {formatErrorMessage(locale || "en", "500Content")}
        </h3>
      )}
    </div>
  );
};

export { ErrorFallbackComponent };
