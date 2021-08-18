import React from "react";

import { Header } from "./header";
import { DesktopNavigationBar } from "./navigation-bars/desktop-navigation-bar";
import { MobileNavigationBar } from "./navigation-bars/mobile-navigation-bar";
import { NavigationBreadcrumbs } from "./navigation-breadcrumbs";

const Layout: React.FC<{
  breadcrumbs: string | false;
  title?: string;
}> = ({ children, title, breadcrumbs }) => {
  return (
    <main className="w-full h-auto lg:h-screen max-w-screen-lg mx-auto">
      <div className="block lg:hidden">
        <Header viewport="mobile" />
        <MobileNavigationBar />
      </div>
      <div className="flex">
        <div className="hidden lg:block w-2/6 font-semibold">
          <DesktopNavigationBar />
        </div>
        <div
          className={`${
            !title && !breadcrumbs ? "flex items-center" : ""
          } w-11/12 lg:w-3/5 mx-auto`}
        >
          {title ? (
            <h1
              className={`${
                !breadcrumbs ? "mb-10 lg:mb-16" : ""
              } mt-2 pt:4 lg:pt-10 pb-4`}
            >
              {title}
            </h1>
          ) : null}
          <NavigationBreadcrumbs breadcrumbs={breadcrumbs} />
          <div className="container mb-40 lg:mb-0">{children}</div>
        </div>
      </div>
    </main>
  );
};

export { Layout };
