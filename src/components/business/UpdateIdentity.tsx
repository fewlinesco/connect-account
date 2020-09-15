import { useRouter } from "next/router";
import React from "react";

import { Identity, ReceivedIdentityTypes } from "../../@types/Identity";
import { AddIdentity } from "./AddIdentity";
import { DeleteIdentity } from "./DeleteIdentity";

interface UpdateIdentityProps {
  identity: Identity;
  children: (props: {
    updateIdentity: (newValue: string) => Promise<void>;
    type: ReceivedIdentityTypes;
  }) => JSX.Element;
}

export const UpdateIdentity: React.FC<UpdateIdentityProps> = ({
  identity,
  children,
}) => {
  const router = useRouter();

  const { value, type } = identity;

  return (
    <AddIdentity type={type}>
      {({ addIdentity }) => (
        <DeleteIdentity type={type} value={value}>
          {({ deleteIdentity }) =>
            children({
              updateIdentity: async function (newValue): Promise<void> {
                addIdentity(newValue)
                  .then(deleteIdentity)
                  .then(() => {
                    router && router.push(`/account/logins/${type}/validation`);
                  })
                  .catch((error: Error) => {
                    throw error;
                  });
              },
              type,
            })
          }
        </DeleteIdentity>
      )}
    </AddIdentity>
  );
};
