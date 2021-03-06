import React from "react";

import { ShowMoreButton } from "./buttons";

const StandardShowMoreButton = (): JSX.Element => {
  const [hideList, setHideList] = React.useState<boolean>(true);

  return (
    <ShowMoreButton
      hideList={hideList}
      quantity={4}
      onPress={() => setHideList(!hideList)}
    />
  );
};

export { StandardShowMoreButton };
export default {
  title: "components/Show More Button",
  component: ShowMoreButton,
};
