import React from "react";
import styled from "styled-components";

const PasswordRulesErrorList: React.FC<{
  rules: Record<string, string>;
}> = ({ rules }) => {
  const {
    min_digits_minimum,
    min_non_digits_minimum,
    min_total_characters_minimum,
  } = rules;

  const isMinDigitsPlural = Number(min_digits_minimum) > 1;
  const isMinNonDigitsPlural = Number(min_non_digits_minimum) > 1;
  const isMinTotalCharsPlural = Number(min_total_characters_minimum) > 1;

  return (
    <PasswordRestrictionErrorWrapper>
      <p>The password you enter does not meet the criteria.</p>
      <p>Ensure that your password contains at least:</p>
      <ul>
        <li>
          {min_digits_minimum} digit{isMinDigitsPlural ? "s" : ""}
        </li>
        <li>
          {min_non_digits_minimum} non-digit
          {isMinNonDigitsPlural ? "s" : ""}
        </li>
        <li>
          {min_total_characters_minimum} character
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
