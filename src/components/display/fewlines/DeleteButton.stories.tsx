import React from "react";

import { DeleteButton } from "./DeleteButton";

export default { title: "DeleteButton", component: DeleteButton };

export const DefaultDeleteButton = (): JSX.Element => {
  const voidPromise: Promise<void> = new Promise((resolve) => resolve());

  return <DeleteButton deleteIdentity={() => voidPromise}>Delete</DeleteButton>;
};
