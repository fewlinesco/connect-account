import React from "react";

import { ClickAwayListener } from "../ClickAwayListener";
import { MobileNavigationBar } from "./MobileNavigationBar";

export default {
  title: "components/MobileNavigationBar",
  component: MobileNavigationBar,
};

export const StandardMobileNavigationBar = (): JSX.Element => {
  const [open, setOpen] = React.useState<boolean>(true);
  return (
    <>
      {open && <ClickAwayListener onClick={() => setOpen(false)} />}
      <MobileNavigationBar open={open} setOpen={setOpen} />
    </>
  );
};
