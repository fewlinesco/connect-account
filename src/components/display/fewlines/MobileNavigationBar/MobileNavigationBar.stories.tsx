import React from "react";

import { ClickAwayListener } from "../ClickAwayListener";
import { MobileNavigationBar } from "./MobileNavigationBar";

export default {
  title: "components/Mobile Navigation Bar",
  component: MobileNavigationBar,
};

export const StandardMobileNavigationBar = (): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  return (
    <>
      {open && <ClickAwayListener onClick={() => setIsOpen(false)} />}
      <MobileNavigationBar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
