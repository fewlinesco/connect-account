import React from "react";

import { HttpVerbs } from "../../@types/HttpVerbs";
import { IdentityTypes } from "../../@types/Identity";
import { useCookies } from "../../hooks/useCookies";
import { fetchJson } from "../../utils/fetchJson";

interface AddIdentityProps {
  type: IdentityTypes;
  children: (props: {
    addIdentity: (value: string) => Promise<Response>;
    type: IdentityTypes;
  }) => JSX.Element;
}

export const AddIdentity: React.FC<AddIdentityProps> = ({ type, children }) => {
  const { data, error } = useCookies();
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

  const addIdentity = (value: string): Promise<Response> => {
    const body = {
      userId: userSub,
      type: type.toUpperCase(),
      value,
    };

    return fetchJson("api/identities", HttpVerbs.POST, body);
  };

  return children({ addIdentity, type });
};
