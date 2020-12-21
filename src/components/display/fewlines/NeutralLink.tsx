import Link, { LinkProps } from "next/link";
import React from "react";
import style from "styled-components";

interface ExtendedLinkProps extends LinkProps {
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
}

export const NeutralLink: React.FC<ExtendedLinkProps> = ({
  href,
  as,
  className,
  onClick,
  children,
  tabIndex,
}) => {
  return (
    <Link href={href} as={as} passHref>
      <NeutralAnchor
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
      >
        {children}
      </NeutralAnchor>
    </Link>
  );
};

const NeutralAnchor = style.a`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.black};

  &:visit {
    color: ${({ theme }) => theme.colors.black};
  }

  &:hover {
    cursor: pointer;
  }
`;
