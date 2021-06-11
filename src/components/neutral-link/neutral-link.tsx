import { AriaLinkOptions, useLink } from "@react-aria/link";
import Link from "next/link";
import React from "react";
import style from "styled-components";
import { UrlObject } from "url";

import { useUserLocale } from "@src/context/locale-context";

interface ExtendedLinkProps extends AriaLinkOptions {
  href: string | UrlObject;
  as?: string | UrlObject;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NeutralLink: React.FC<ExtendedLinkProps> = (props) => {
  const { locale } = useUserLocale();
  const { href, as, className, onClick, children } = props;
  const linkRef = React.useRef(null);
  const { linkProps } = useLink(props, linkRef);

  return (
    <Link href={href} as={as} passHref locale={locale}>
      <NeutralAnchor
        {...linkProps}
        className={className}
        onClick={onClick}
        ref={linkRef}
      >
        {children}
      </NeutralAnchor>
    </Link>
  );
};

const NeutralAnchor = style.a<Record<string, unknown>>`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};

  &:visit {
    color: ${({ theme }) => theme.colors.black};
  }

  &:hover {
    cursor: pointer;
  }
`;

export { NeutralLink };
