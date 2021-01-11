import React from "react";

import { ShowMoreButton } from "./show-more-button";

export default {
  title: "components/Show More Button",
  component: ShowMoreButton,
};

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
