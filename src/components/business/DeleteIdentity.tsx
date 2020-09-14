import { useRouter } from "next/router";
import React from "react";

import { HttpVerbs } from "../../@types/HttpVerbs";
import { IdentityTypes } from "../../@types/Identity";
import { useCookies } from "../../hooks/useCookies";
import { fetchJson } from "../../utils/fetchJson";

interface DeleteIdentityProps {
  type: IdentityTypes;
  value: string;
  children: (props: { deleteIdentity: () => Promise<void> }) => JSX.Element;
}

export const DeleteIdentity: React.FC<DeleteIdentityProps> = ({
  type,
  value,
  children,
}) => {
  const { data, error } = useCookies();
  const router = useRouter();
  const [userSub, setUserSub] = React.useState("");

  if (error) {
    return <div>Failed to load</div>;
  }

  if (!data) {
    return null;
  }

  async function getMongoUser(userDocumentId: string): Promise<void> {
    await fetchJson("/api/get-mongo-user", HttpVerbs.POST, {
      userDocumentId,
    })
      .then((response) => response.json())
      .then((x: string) => setUserSub(x));
  }

  React.useEffect(() => {
    if (data) {
      getMongoUser(data.userDocumentId);
    }
  }, [userSub, data]);

  const requestData = {
    userId: userSub,
    type: type,
    value: value,
  };

  const deleteIdentity = async (): Promise<void> => {
    return fetchJson("/api/identities", HttpVerbs.DELETE, requestData)
      .then(() => {
        router && router.push("/account/logins/");
      })
      .catch((error: Error) => {
        throw error;
      });
  };

  return children({ deleteIdentity });
};
