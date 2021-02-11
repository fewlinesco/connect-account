import React from "react";

import { StoriesContainer } from "../containers/stories-container";
import { PasswordRulesErrorList } from "./password-rules-error-list";

const singularRules = {
  min_digits: {
    error: true,
    minimum: 1,
  },
  min_non_digits: {
    error: false,
    minimum: 1,
  },
  min_total_characters: {
    error: true,
    minimum: 1,
  },
};

const pluralRules = {
  min_digits: {
    error: true,
    minimum: 6,
  },
  min_non_digits: {
    error: false,
    minimum: 6,
  },
  min_total_characters: {
    error: true,
    minimum: 6,
  },
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
