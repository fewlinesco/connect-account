import React from "react";

import {
  Button,
  ButtonVariant,
  CloseModalCrossButton,
} from "./buttons/buttons";
import { ModalOverlay } from "./modal-overlay";

enum ModalVariant {
  MARK_AS_PRIMARY = "MARK_AS_PRIMARY",
  DELETION = "DELETION",
}

const ModalWrapper: React.FC<{
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsModalOpen, children }) => {
  React.useEffect(() => {
    const escapePressed = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keyup", escapePressed);
    return () => window.removeEventListener("keyup", escapePressed);
  });

  return (
    <>
      <ModalOverlay
        onClick={() => {
          setIsModalOpen(false);
        }}
      />
      <div className="flex flex-col items-center px-16 pt-16 pb-8 lg:p-20 bg-background fixed lg:absolute bottom-0 right-0 lg:right-2/4 lg:bottom-2/4 w-full lg:w-3/5 xl:w-1/5 rounded-none lg:rounded-lg z-30 transform-none lg:transform lg:translate-x-2/4 lg:translate-y-2/4">
        <CloseModalCrossButton onPress={() => setIsModalOpen(false)} />
        {children}
      </div>
    </>
  );
};

const Modal: React.FC<{
  variant: ModalVariant;
  textContent: { info: string; confirm: string; cancel: string };
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmationPress: () => Promise<void>;
}> = ({ setIsModalOpen, variant, onConfirmationPress, textContent }) => {
  React.useEffect(() => {
    const escapePressed = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keyup", escapePressed);
    return () => window.removeEventListener("keyup", escapePressed);
  });

  if (variant === ModalVariant.MARK_AS_PRIMARY) {
    return (
      <ModalWrapper setIsModalOpen={setIsModalOpen}>
        <ModalInfo>{textContent.info}</ModalInfo>
        <Button
          type="button"
          variant={ButtonVariant.PRIMARY}
          onPress={onConfirmationPress}
        >
          {textContent.confirm}
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.SECONDARY}
          onPress={() => {
            setIsModalOpen(false);
          }}
        >
          {textContent.cancel}
        </Button>
      </ModalWrapper>
    );
  }

  if (variant === ModalVariant.DELETION) {
    return (
      <ModalWrapper setIsModalOpen={setIsModalOpen}>
        <ModalInfo>{textContent.info}</ModalInfo>
        <Button
          type="button"
          variant={ButtonVariant.DANGER}
          onPress={onConfirmationPress}
        >
          {textContent.confirm}
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.SECONDARY}
          onPress={() => {
            setIsModalOpen(false);
          }}
        >
          {textContent.cancel}
        </Button>
      </ModalWrapper>
    );
  }

  throw new Error("Invalid ModalVariant");
};

const ModalInfo: React.FC = ({ children }) => {
  return <p className="mb-8 leading-6 text-center break-words">{children}</p>;
};

export { Modal, ModalVariant };
