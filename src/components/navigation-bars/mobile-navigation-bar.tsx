import { useRouter } from "next/router";
import React from "react";

import { Arrow } from "../icons/arrow";
import { BurgerIcon } from "../icons/burger-icon";
import { NavBarCrossIcon } from "../icons/navbar-cross-icon";
import { RightChevron } from "../icons/right-chevron";
import { WhiteWorldIcon } from "../icons/world-icon/white-world-icon";
import { LogoutAnchor } from "../logout-anchor";
import { ModalOverlay } from "../modal-overlay";
import { NeutralLink } from "../neutral-link";
import { getNavigationSections } from "./navigation-sections";
import { formatNavigation } from "@src/configs/intl";

const MobileNavigationBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      {isOpen ? <ModalOverlay onClick={() => setIsOpen(false)} /> : null}
      <div className="block lg:hidden fixed bottom-0 left-0 w-full bg-background z-20">
        {isOpen ? (
          <>
            {getNavigationSections().map(([title, { href, icon }]) => {
              return (
                <NeutralLink
                  className="h-28 flex items-center justify-between px-8"
                  href={href}
                  onClick={() => setIsOpen(false)}
                  key={title + href}
                >
                  {icon}
                  <p className="ml-6 flex-grow">
                    {formatNavigation(router.locale || "en", title)}
                  </p>
                  <RightChevron />
                </NeutralLink>
              );
            })}
            <LogoutAnchor />
          </>
        ) : null}
        <div className="h-28 flex border-t border-separator">
          {isOpen ? (
            <div
              className="flex w-1/2 items-center bg-primary "
              onClick={() => setIsOpen(false)}
            >
              <NeutralLink
                className="flex w-full items-center justify-evenly "
                href="/account/locale/"
              >
                <WhiteWorldIcon />
                <p className="text-background">
                  {formatNavigation(router.locale || "en", "language")}
                </p>
              </NeutralLink>
            </div>
          ) : (
            <div
              className="flex w-1/2 justify-around items-center bg-box "
              onClick={() => router.back()}
            >
              <Arrow />
              <p>{formatNavigation(router.locale || "en", "back")}</p>
            </div>
          )}
          <div
            className="flex w-1/2 justify-around items-center bg-box border-l border-separator"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <>
                <p>{formatNavigation(router.locale || "en", "close")}</p>
                <NavBarCrossIcon />
              </>
            ) : (
              <>
                <p>{formatNavigation(router.locale || "en", "menu")}</p>
                <BurgerIcon />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { MobileNavigationBar };
