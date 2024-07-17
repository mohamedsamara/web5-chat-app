/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  RefObject,
  ChangeEvent,
} from "react";
import { useAtom } from "jotai";

import {
  replyScrollAtom,
  isMsgSwipingAtom,
  attachmentViewerAtom,
} from "lib/stores";
import { AttachmentViewerParams, AttachmentDisplayStatus } from "lib/types";

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

type ElementRef = RefObject<HTMLVideoElement>;
type SelectEvent = ChangeEvent<HTMLSelectElement>;

type PlayerState = {
  isPlaying: boolean;
  progress: number;
  speed: number;
  isMuted: boolean;
};

type PlayerProps = {
  playerState: PlayerState;
  togglePlay: () => void;
  handleOnTimeUpdate: () => void;
  handleVideoProgress: (value: number) => void;
  handleVideoSpeed: (e: SelectEvent) => void;
  toggleMute: () => void;
};

export const usePlayer = (
  videoElement: ElementRef,
  autoPlay: boolean,
  status: AttachmentDisplayStatus
): PlayerProps => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
  });

  useEffect(() => {
    if (status === "LOADED" && autoPlay) {
      togglePlay();
    }
  }, [videoElement, autoPlay, status]);

  useEffect(() => {
    playerState.isPlaying
      ? videoElement.current!.play()
      : videoElement.current!.pause();
  }, [playerState.isPlaying, videoElement]);

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  useEffect(() => {
    if (playerState.progress === 100) {
      setPlayerState({
        ...playerState,
        isPlaying: false,
        progress: 0,
      });
    }
  }, [playerState.progress]);

  const handleOnTimeUpdate = () => {
    const progress =
      (videoElement.current!.currentTime / videoElement.current!.duration) *
      100;
    setPlayerState({
      ...playerState,
      progress,
    });
  };

  const handleVideoProgress = (value: number) => {
    const manualChange = Number(value);
    videoElement.current!.currentTime =
      (videoElement.current!.duration / 100) * manualChange;
    setPlayerState({
      ...playerState,
      progress: manualChange,
    });
  };

  const handleVideoSpeed = (e: SelectEvent) => {
    const speed = Number(e.target.value);
    videoElement.current!.playbackRate = speed;
    setPlayerState({
      ...playerState,
      speed,
    });
  };

  useEffect(() => {
    playerState.isMuted
      ? (videoElement.current!.muted = true)
      : (videoElement.current!.muted = false);
  }, [playerState.isMuted, videoElement]);

  const toggleMute = () => {
    setPlayerState({
      ...playerState,
      isMuted: !playerState.isMuted,
    });
  };

  return {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  };
};
