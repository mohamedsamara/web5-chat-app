import {
  useState,
  useEffect,
  useCallback,
  useRef,
  PropsWithChildren,
} from "react";
import { X } from "lucide-react";

import { useClickOutside } from "lib/hooks";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import Portal from "./Portal";

type Props = PropsWithChildren & {
  visible: boolean;
  onClose: () => void;
};

const Modal = ({ visible, onClose, children }: Props) => {
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
          "fixed w-screen h-screen flex justify-center items-center invisible opacity-0 top-0 inset-x-0 bg-black/80 z-[1]",
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
        <div ref={modalRef}>{children}</div>
        <div className="absolute top-[10px] right-[14px] z-[3]">
          <Button
            variant="none"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={closeModal}
          >
            <span className="sr-only">Close modal</span>
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
