import React from "react";

const ModalOverlay: React.FC<{ onClick?: () => void; className?: string }> = ({
  onClick,
  className,
}) => {
  return (
    <div
      className={
        "fixed bottom-0 left-0 w-screen h-screen z-10 bg-black opacity-25 " +
        className
      }
      onClick={onClick}
      data-testid="modal-overlay"
    />
  );
};

export { ModalOverlay };
