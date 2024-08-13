import {
  useState,
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
} from "react";

import { useClickOutside } from "lib/hooks";
import { cn } from "lib/utils";
import Portal from "./Portal";
import { CloseButton } from "../Buttons";

type Props = PropsWithChildren & {
  className?: string;
  visible: boolean;
  onClose: () => void;
};

const Modal = ({ className, visible, onClose, children }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useClickOutside(modalRef, closeModal);

  useEffect(() => {
    if (visible) setIsVisible(true);
  }, [visible]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [handleKeyPress, isVisible]);

  return (
    <Portal>
      <div
        className={cn(
          "fixed w-screen h-screen flex justify-center items-center invisible opacity-0 top-0 inset-x-0 bg-black/90 z-[1]",
          isVisible ? "visible opacity-100" : "invisible"
        )}
        style={{
          transition: "visibility 0.2s linear, opacity 0.2s linear",
        }}
      />
      <div
        className={cn(
          "fixed w-screen h-screen flex justify-center items-center invisible opacity-0 top-0 inset-x-0 z-[2]",
          isVisible ? "visible opacity-100" : "invisible"
        )}
        style={{
          transition: "visibility 0.2s linear, opacity 0.2s linear",
        }}
      >
        <div className={className} ref={modalRef}>
          {children}
        </div>
        <div className="absolute top-[10px] right-[14px] z-[3]">
          <CloseButton onClick={closeModal} iconStyles="text-white h-12 w-12" />
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
