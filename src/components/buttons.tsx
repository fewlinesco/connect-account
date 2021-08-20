import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { CookieIcon } from "./icons/cookie-icon";
import { CrossIcon } from "./icons/cross-icon";
import { Triangle } from "./icons/triangle";
import { deviceBreakpoints } from "@src/design-system/theme";

interface ButtonProps extends AriaButtonProps {
  type: "button" | "submit" | "reset";
  onPress?: () => void;
  className: string;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { className, children } = props;
  const buttonRef = React.useRef(null);
  const { buttonProps } = useButton(props, buttonRef);

  return (
    <button {...buttonProps} ref={buttonRef} className={className}>
      {children}
    </button>
  );
};

interface ShowMoreButtonProps extends AriaButtonProps {
  hideList: boolean;
  quantity: number;
  onPress: () => void;
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = (props) => {
  const { hideList, quantity } = props;
  const showMoreButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    showMoreButtonRef,
  );
  const { formatMessage } = useIntl();

  return (
    <div
      {...buttonProps}
      ref={showMoreButtonRef}
      className="flex justify-center items-center h-16 mb-8 py-8 cursor-pointer"
    >
      <p className="mr-2">{`${formatMessage({
        id: hideList ? "showMore" : "hide",
      })} (${quantity}) `}</p>
      <Triangle rotate={hideList} />
    </div>
  );
};

const CloseModalCrossButton: React.FC<{ onPress: () => void }> = (props) => {
  const closeConfirmationBoxButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    closeConfirmationBoxButtonRef,
  );

  return (
    <div
      {...buttonProps}
      className="absolute top-8 right-8 cursor-pointer"
      ref={closeConfirmationBoxButtonRef}
    >
      <CrossIcon />
    </div>
  );
};

const CookieButton: React.FC<{ onPress: () => void; isOpen: boolean }> = (
  props,
) => {
  const cookieButtonRef = React.useRef(null);
  const { buttonProps } = useButton(
    { ...props, elementType: "div" },
    cookieButtonRef,
  );

  return (
    <CookieButtonStyle {...buttonProps} ref={cookieButtonRef}>
      {props.isOpen ? <CrossIcon /> : <CookieIcon />}
    </CookieButtonStyle>
  );
};

const CookieButtonStyle = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii[3]};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.box};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  :hover {
    transform: scale(1.1);
  }

  @media ${deviceBreakpoints.m} {
    display: none;
  }
`;

export { Button, ShowMoreButton, CloseModalCrossButton, CookieButton };
