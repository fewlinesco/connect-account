import { useRouter } from "next/router";
import React from "react";

import { formatErrorMessage } from "@src/configs/intl";

const PasswordRulesErrorList: React.FC<{
  rules: Record<string, string>;
}> = ({
  rules: {
    min_digits_minimum,
    min_non_digits_minimum,
    min_total_characters_minimum,
  },
}) => {
  const { locale } = useRouter();

  return (
    <div className=" mb-12 ml-8 text-red">
      <p className="leading-10">
        {formatErrorMessage(locale || "en", "passwordCriteria")}
      </p>
      <p className="leading-10">
        {formatErrorMessage(locale || "en", "passwordInfo")}
      </p>
      <ul className="list-disc">
        <li className="list-inside my-4">
          {formatErrorMessage(locale || "en", "passwordRuleDigit", {
            digitCount: min_digits_minimum,
          })}
        </li>
        <li className="list-inside my-4">
          {formatErrorMessage(locale || "en", "passwordRuleNonDigit", {
            nonDigitCount: min_non_digits_minimum,
          })}
        </li>
        <li className="list-inside my-4">
          {formatErrorMessage(locale || "en", "passwordRuleCharacter", {
            characterCount: min_total_characters_minimum,
          })}
        </li>
      </ul>
    </div>
  );
};

export { PasswordRulesErrorList };
