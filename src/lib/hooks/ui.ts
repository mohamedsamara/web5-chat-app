/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  RefObject,
} from "react";
import { useAtom } from "jotai";

import {
  replyScrollAtom,
  isMsgSwipingAtom,
  attachmentViewerAtom,
} from "lib/stores";
import { AttachmentViewerParams, MsgAttachmentType, ChatMsg } from "lib/types";

type CopyStatus = "inactive" | "copied" | "failed";
export const useCopyToClipboard = (
  text: string,
  notifyTimeout = 2500
): [CopyStatus, () => void] => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("inactive");
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus("copied"),
      () => setCopyStatus("failed")
    );
  }, [text]);

  useEffect(() => {
    if (copyStatus === "inactive") {
      return;
    }
    const timeoutId = setTimeout(
      () => setCopyStatus("inactive"),
      notifyTimeout
    );
    return () => clearTimeout(timeoutId);
  }, [copyStatus]);

  return [copyStatus, copy];
};

type FunctionType = (...args: any[]) => void;
export const useDebounce = <T extends FunctionType>(
  callback: T,
  delay = 200
) => {
  const callbackRef = useRef<T | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFunction = (...args: any[]) => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (!callbackRef.current) return;

      callbackRef.current(...args);
    }, delay);
  };

  return debouncedFunction;
};

export const useReplyScrollSpy = () => {
  const [reply, setReply] = useAtom(replyScrollAtom);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => setReply({ ...reply, visible: entry.isIntersecting }),
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      ),
    [reply]
  );

  useEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  useEffect(() => {
    if (reply.visible) {
      timerRef.current = setTimeout(() => reset(), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [reply.visible]);

  const reset = async () => {
    if (element) observer.unobserve(element);
    setElement(null);
    setReply({ ...reply, visible: false, uid: "" });
  };

  const scrollToMsg = (uid: string) => {
    const element = document.getElementById(`msg-${uid}`);
    if (!element) return;
    setReply({ ...reply, uid });
    setElement(element);
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const onReplyClick = useDebounce((uid) => scrollToMsg(uid));

  return { reply, scrollToMsg: onReplyClick };
};

export const useIsMsgSwiping = () => {
  const [isMsgSwiping, setIsMsgSwiping] = useAtom(isMsgSwipingAtom);
  return { isMsgSwiping, setIsMsgSwiping };
};

export const useAttachmentViewer = () => {
  const [attachmentViewer, setAttachmentViewer] = useAtom(attachmentViewerAtom);

  const openViewer = (params: AttachmentViewerParams) =>
    setAttachmentViewer({ visible: true, params });
  const closeViewer = () =>
    setAttachmentViewer({ visible: false, params: null });

  return { attachmentViewer, openViewer, closeViewer };
};

export const useIsAttachmentViewable = (type: MsgAttachmentType) => {
  const isNotAllowed = type === "FILE" || type === "AUDIO";
  return { isViewable: !isNotAllowed };
};

export const useIsPreviewAttachment = (type: MsgAttachmentType) => {
  const isPreview = type === "VIDEO";
  return { isPreview };
};

export const useIsSwipable = (msg: ChatMsg) => {
  let isSwipeable = true;
  if (msg.type === "ATTACHMENT" && !msg.attachment) isSwipeable = false;
  return { isSwipeable };
};

type Handler = (event: MouseEvent) => void;
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
};

export const useDimension = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const getDimensions = () => ({
      width: ref.current?.offsetWidth || 0,
      height: ref.current?.offsetHeight || 0,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (ref.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return dimensions;
};
