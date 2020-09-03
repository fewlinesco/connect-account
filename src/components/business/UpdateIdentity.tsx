import { useRouter } from "next/router";
import React from "react";

import { IdentityTypes, Identity } from "../../@types/Identity";
import { useCookies } from "../../hooks/useCookies";
import { AddIdentity } from "./AddIdentity";
import { DeleteIdentity } from "./DeleteIdentity";

interface UpdateIdentityProps {
  identity: Identity;
  children: (props: {
    updateIdentity: (newValue: string) => Promise<void>;
    type: IdentityTypes;
  }) => JSX.Element;
}

export const UpdateCurrentIdentity: React.FC<UpdateIdentityProps> = ({
  identity,
  children,
}) => {
  const { data, error } = useCookies();
  const router = useRouter();

  const { value } = identity;
  let type: IdentityTypes = IdentityTypes.EMAIL;
  identity.type === "phone" && (type = IdentityTypes.PHONE);

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

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
