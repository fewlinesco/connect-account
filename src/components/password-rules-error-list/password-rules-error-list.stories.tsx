import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { PasswordRulesErrorList } from "./password-rules-error-list";

const singularRules = {
  min_digits_error: "true",
  min_digits_minimum: "1",
  min_non_digits_error: "true",
  min_non_digits_minimum: "1",
  min_total_characters_error: "true",
  min_total_characters_minimum: "1",
};

const pluralRules = {
  min_digits_error: "true",
  min_digits_minimum: "6",
  min_non_digits_error: "true",
  min_non_digits_minimum: "6",
  min_total_characters_error: "true",
  min_total_characters_minimum: "6",
};

const PasswordRulesErrorListSingular = (): JSX.Element => {
  return (
    <StoriesContainer>
      <PasswordRulesErrorList rules={singularRules} />
    </StoriesContainer>
  );
};

const PasswordRulesErrorListPlural = (): JSX.Element => {
  return (
    <StoriesContainer>
      <PasswordRulesErrorList rules={pluralRules} />
    </StoriesContainer>
  );
};

export { PasswordRulesErrorListSingular, PasswordRulesErrorListPlural };
export default {
  title: "components/PasswordRulesErrorList",
  component: PasswordRulesErrorList,
};
