import { useRouter } from "next/router";
import React from "react";

import {
  IdentityTypes,
  Identity,
  ReceivedIdentityTypes,
} from "../../@types/Identity";
import { AddIdentity } from "./AddIdentity";
import { DeleteIdentity } from "./DeleteIdentity";

interface UpdateIdentityProps {
  identity: Identity;
  children: (props: {
    updateIdentity: (newValue: string) => Promise<void>;
    castedIdentityType: IdentityTypes;
  }) => JSX.Element;
}

export const UpdateIdentity: React.FC<UpdateIdentityProps> = ({
  identity,
  children,
}) => {
  const router = useRouter();

  const { value, type } = identity;

  const castedIdentityType =
    type === ReceivedIdentityTypes.PHONE
      ? IdentityTypes.PHONE
      : IdentityTypes.EMAIL;

  return (
    <AddIdentity type={castedIdentityType}>
      {({ addIdentity }) => (
        <DeleteIdentity type={castedIdentityType} value={value}>
          {({ deleteIdentity }) =>
            children({
              updateIdentity: async function (newValue): Promise<void> {
                addIdentity(newValue)
                  .then(deleteIdentity)
                  .then(() => {
                    router && router.push(`/account/logins/${type}/validation`);
                  });
              },
              castedIdentityType,
            })
          }
        </DeleteIdentity>
      )}
    </AddIdentity>
  );
};
