import { AriaLinkOptions, useLink } from "@react-aria/link";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { UrlObject } from "url";

interface ExtendedLinkProps extends AriaLinkOptions {
  href: string | UrlObject;
  as?: string | UrlObject;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NeutralLink: React.FC<ExtendedLinkProps> = (props) => {
  const { href, as, className, onClick, children } = props;
  const linkRef = React.useRef(null);
  const { linkProps } = useLink(props, linkRef);
  const { locale } = useRouter();

  return (
    <Link href={href} as={as} locale={locale} passHref>
      <a
        {...linkProps}
        className={`no-underline text-black hover:cursor-pointer visited:text-black ${className}`}
        onClick={onClick}
        ref={linkRef}
      >
        {children}
      </a>
    </Link>
  );
};

export { NeutralLink };
