import { useRouter } from "next/router";
import React from "react";

import { AddIdentity_Deprecated } from "./AddIdentity.deprecated";
import { DeleteIdentity } from "./DeleteIdentity";
import type { Identity, ReceivedIdentityTypes } from "@src/@types/Identity";

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
    <AddIdentity_Deprecated type={type}>
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
    </AddIdentity_Deprecated>
  );
};
