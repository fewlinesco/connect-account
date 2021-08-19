import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";
import React from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { CookieIcon } from "../icons/cookie-icon";
import { CrossIcon } from "../icons/cross-icon";
import { Triangle } from "../icons/triangle";
import { deviceBreakpoints } from "@src/design-system/theme";

enum ButtonVariant {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
  LIGHT_GREY = "LIGHT_GREY",
  DANGER = "DANGER",
  GHOST = "GHOST",
  PRIMARY_COOKIE = "PRIMARY_COOKIE",
  GHOST_COOKIE = "GHOST_COOKIE",
}

function getButtonStyle(variant?: ButtonVariant): string {
  const baseButtonStyle =
    "h-16 rounded text-m cursor-pointer w-full mb-4 break-all";

  if (variant === ButtonVariant.PRIMARY) {
    return `${baseButtonStyle} bg-primary text-background`;
  }

  if (variant === ButtonVariant.SECONDARY) {
    return `${baseButtonStyle} bg-background text-primary border border-primary border-solid`;
  }

  if (variant === ButtonVariant.LIGHT_GREY) {
    return `${baseButtonStyle} mb-0 lg:mb-4 py-12 px-16 lg:p-0 text-black bg-background lg:bg-grey-light text-base border border-solid border-grey-light lg:border-none`;
  }

  if (variant === ButtonVariant.DANGER) {
    return `${baseButtonStyle} bg-red text-background`;
  }

  if (variant === ButtonVariant.GHOST) {
    return `${baseButtonStyle} bg-background text-red`;
  }

  if (variant === ButtonVariant.PRIMARY_COOKIE) {
    return `${baseButtonStyle} h-20 mb-0 bg-primary text-background rounded-t-none rounded-br-lg rounded-bl-none`;
  }

  if (variant === ButtonVariant.GHOST_COOKIE) {
    return `${baseButtonStyle} mb-0 text-primary bg-background rounded-t-none rounded-br-none rounded-bl-lg border-t border-solid border-separator`;
  }

  return baseButtonStyle;
}

interface ButtonProps extends AriaButtonProps {
  type: "button" | "submit" | "reset";
  onPress?: () => void;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { variant, children } = props;
  const buttonRef = React.useRef(null);
  const { buttonProps } = useButton(props, buttonRef);

  return (
    <button
      {...buttonProps}
      variant={variant}
      ref={buttonRef}
      className={getButtonStyle(variant)}
    >
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

export {
  Button,
  getButtonStyle,
  ButtonVariant,
  ShowMoreButton,
  CloseModalCrossButton,
  CookieButton,
};
