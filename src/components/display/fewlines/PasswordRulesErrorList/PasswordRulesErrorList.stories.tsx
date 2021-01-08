import React from "react";

import { StoriesContainer } from "../../../containers/stories-container";
import { PasswordRulesErrorList } from "./PasswordRulesErrorList";

export default {
  title: "components/PasswordRulesErrorList",
  component: PasswordRulesErrorList,
};

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

export const PasswordRulesErrorListSingular = (): JSX.Element => {
  return (
    <StoriesContainer>
      <PasswordRulesErrorList rules={singularRules} />
    </StoriesContainer>
  );
};

export const PasswordRulesErrorListPlural = (): JSX.Element => {
  return (
    <StoriesContainer>
      <PasswordRulesErrorList rules={pluralRules} />
    </StoriesContainer>
  );
};
