import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

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
    <PasswordRestrictionErrorWrapper>
      <p>{formatErrorMessage(locale || "en", "passwordCriteria")}</p>
      <p>{formatErrorMessage(locale || "en", "passwordInfo")}</p>
      <ul>
        <li>
          {formatErrorMessage(locale || "en", "passwordRuleDigit", {
            digitCount: min_digits_minimum,
          })}
        </li>
        <li>
          {formatErrorMessage(locale || "en", "passwordRuleNonDigit", {
            nonDigitCount: min_non_digits_minimum,
          })}
        </li>
        <li>
          {formatErrorMessage(locale || "en", "passwordRuleCharacter", {
            characterCount: min_total_characters_minimum,
          })}
        </li>
      </ul>
    </PasswordRestrictionErrorWrapper>
  );
};

const PasswordRestrictionErrorWrapper = styled.div`
  margin: 0 0 3rem 2rem;
  color: ${({ theme }) => theme.colors.red};

  p {
    line-height: ${({ theme }) => theme.lineHeights.copy};
  }

  li {
    list-style: inside;
    margin: 1rem 0;
  }
`;

export { PasswordRulesErrorList };
