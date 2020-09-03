import { useRouter } from "next/router";
import React from "react";

import { IdentityTypes, Identity } from "../../@types/Identity";
import { AddIdentity } from "./AddIdentity";
import { DeleteIdentity } from "./DeleteIdentity";

interface UpdateIdentityProps {
  identity: Identity;
  children: (props: {
    updateIdentity: (newValue: string) => Promise<void>;
    type: IdentityTypes;
  }) => JSX.Element;
}

export const UpdateIdentity: React.FC<UpdateIdentityProps> = ({
  identity,
  children,
}) => {
  const router = useRouter();

  const { value } = identity;
  let type: IdentityTypes = IdentityTypes.EMAIL;
  identity.type === "phone" && (type = IdentityTypes.PHONE);

  return (
    <AddIdentity type={type}>
      {({ addIdentity }) => (
        <DeleteIdentity type={type} value={value}>
          {({ deleteIdentity }) =>
            children({
              updateIdentity: async function (newValue): Promise<void> {
                addIdentity(newValue)
                  .then(() => {
                    deleteIdentity();
                  })
                  .then(() => {
                    router.push(`/account/logins/${type}/validation`);
                  })
                  .catch((error) => {
                    console.warn(error);
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
