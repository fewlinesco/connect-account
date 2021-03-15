import Link, { LinkProps } from "next/link";
import React from "react";
import { useLink } from "react-aria";
import style from "styled-components";

interface ExtendedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NeutralLink: React.FC<ExtendedLinkProps> = (props) => {
  const { href, as, className, onClick, children } = props;
  const linkRef = React.useRef(null);
  const { linkProps } = useLink(props, linkRef);
  return (
    <Link href={href} as={as} passHref>
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
