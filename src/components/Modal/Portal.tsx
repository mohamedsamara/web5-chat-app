import { useState, useLayoutEffect, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  wrapperId?: string;
};

const Portal = ({
  children,
  wrapperId = "modal",
}: PropsWithChildren<PortalProps>) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId) as HTMLElement;
    let portalCreated = false;
    if (!element) {
      element = createWrapperAndAppendToBody(wrapperId);
      portalCreated = true;
    }

    setPortalElement(element);

    return () => {
      if (portalCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  const createWrapperAndAppendToBody = (elementId: string) => {
    const element = document.createElement("div");
    element.setAttribute("id", elementId);
    document.body.appendChild(element);
    return element;
  };

  if (!portalElement) return null;

  return createPortal(children, portalElement);
};

export default Portal;
