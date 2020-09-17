import React from "react";

import { ShowMoreButton } from "./ShowMoreButton";

export default { title: "ShowMoreButton", component: ShowMoreButton };

export const StandardShowMoreButton = (): JSX.Element => {
  const [hide, setHideSecondary] = React.useState<boolean>(true);
  return (
    <ShowMoreButton
      hide={hide}
      quantity={4}
      setHideSecondary={setHideSecondary}
    />
  );
};
