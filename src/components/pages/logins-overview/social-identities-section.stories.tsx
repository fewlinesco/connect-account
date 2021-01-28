import { Identity, IdentityTypes } from "@fewlines/connect-management";
import React from "react";

import { StoriesContainer } from "../../containers/stories-container";
import { SocialIdentitiesSection } from "./logins-overview";

export default {
  title: "components/ Social Identities Section",
  component: SocialIdentitiesSection,
};

export const StandardSocialIdentitiesSection = (): JSX.Element => {
  const socialIdentities: Identity[] = [
    {
      id: "8f79dcc1-530b-4982-878d-33f0def6a7cf",
      primary: true,
      status: "validated",
      type: IdentityTypes.GITHUB,
      value: "",
    },
    {
      id: "8u76dcc1-530b-4982-878d-33f0def6a7cf",
      primary: false,
      status: "validated",
      type: IdentityTypes.FACEBOOK,
      value: "",
    },
  ];

  return (
    <StoriesContainer>
      <SocialIdentitiesSection
        content={{
          title: "Social logins",
          noIdentityMessage: "No social logins added yet.",
        }}
        identitiesList={socialIdentities}
      />
    </StoriesContainer>
  );
};
