import { PasswordRules } from "@fewlines/connect-management";
import React from "react";
import styled from "styled-components";

const PasswordRulesErrorList: React.FC<{
  rules: PasswordRules;
}> = ({ rules }) => {
  const { min_digits, min_non_digits, min_total_characters } = rules;

  const isMinDigitsPlural = min_digits.minimum > 1;
  const isMinNonDigitsPlural = min_non_digits.minimum > 1;
  const isMinTotalCharsPlural = min_total_characters.minimum > 1;

  return (
    <PasswordRestrictionErrorWrapper>
      <p>The password you enter does not meet the criteria.</p>
      <p>Ensure that your password contains at least:</p>
      <ul>
        <li>
          {min_digits.minimum} digit{isMinDigitsPlural ? "s" : ""}
        </li>
        <li>
          {min_non_digits.minimum} non-digit{isMinNonDigitsPlural ? "s" : ""}
        </li>
        <li>
          {min_total_characters.minimum} character
          {isMinTotalCharsPlural ? "s" : ""}
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
