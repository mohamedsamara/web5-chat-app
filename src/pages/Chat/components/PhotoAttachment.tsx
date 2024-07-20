import { useRef } from "react";
import { Fade } from "transitions-kit";
import { useInView } from "react-intersection-observer";
import { FileImage } from "lucide-react";

import { Attachment } from "lib/types";
import { useAttachment } from "lib/hooks";
import { cn } from "lib/utils";

type Props = {
  className?: string;
  attachment: Attachment;
};

const PhotoAttachment = ({ className, attachment }: Props) => {
  const photoRef = useRef<HTMLImageElement | null>(null);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px",
    triggerOnce: true,
  });

  const { loading, url, status, setStatus } = useAttachment({
    visible: inView,
    attachment,
  });

  return (
    <div ref={ref} className="relative">
      <Fade
        appear={false}
        in={status === "LOADING"}
        timeout={1000}
        unmountOnExit
      >
        <div className="bg-muted" />
      </Fade>
      <Fade in={status === "LOADED"} timeout={1000}>
        <img
          ref={photoRef}
          draggable={false}
          src={url}
          alt="msg photo"
          className={cn("aspect-square object-cover w-full", className)}
          onLoad={() => {
            setStatus("LOADED");
          }}
          onError={() => {
            if (loading || !inView) return;
            setStatus("FAILED");
          }}
        />
      </Fade>
      <Fade in={status === "FAILED"} timeout={1000} mountOnEnter unmountOnExit>
        <div className="bg-muted">
          <FileImage className="absolute inset-0 m-auto w-16 h-16 text-neutral-800" />
        </div>
      </Fade>
    </div>
  );
};

export default PhotoAttachment;
