import { useEffect, useRef } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Fade } from "transitions-kit";
import { useInView } from "react-intersection-observer";
import { FileVideo } from "lucide-react";

import { useAttachment, usePlayer } from "lib/hooks";
import { cn } from "lib/utils";
import { Attachment } from "lib/types";
import { Button } from "components/ui/button";
import { Slider } from "components/ui/slider";

type Props = {
  className?: string;
  isPreview: boolean;
  autoPlay: boolean;
  attachment: Attachment;
};

const VideoAttachment = ({
  className,
  attachment,
  isPreview,
  autoPlay,
}: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
    triggerOnce: true,
  });
  const { loading, url, status, setStatus } = useAttachment({
    visible: inView,
    attachment,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    toggleMute,
  } = usePlayer(videoRef, autoPlay, status);

  useEffect(() => {
    if (url) {
      videoRef.current?.load();
    }
  }, [url]);

  return (
    <div ref={ref} className="relative group">
      <Fade
        appear={false}
        in={status === "LOADING"}
        timeout={1000}
        unmountOnExit
      >
        <div className="bg-muted" />
      </Fade>
      <Fade in={status === "LOADED"} timeout={1000}>
        <div>
          <video
            className={cn("aspect-video object-cover w-full", className)}
            ref={videoRef}
            controls={false}
            onTimeUpdate={handleOnTimeUpdate}
            onLoadedData={() => {
              setStatus("LOADED");
            }}
            onError={() => {
              if (loading || !inView) return;
              setStatus("FAILED");
            }}
          >
            <source src={url} />
          </video>
          {!isPreview && (
            <div className="fade-out group-hover:fade-in absolute bottom-0 right-0 left-0 bg-black/40">
              <div className="flex gap-2 justify-between items-center p-2">
                <Button
                  variant="none"
                  size="icon"
                  className="rounded-full aspect-1 p-0 w-8 h-8"
                  onClick={togglePlay}
                >
                  {!playerState.isPlaying ? (
                    <Play className="w-6 h-6 text-white" />
                  ) : (
                    <Pause className="w-6 h-6 text-white" />
                  )}
                </Button>
                <div className="flex-1">
                  <Slider
                    className="cursor-pointer"
                    min={0}
                    max={100}
                    step={1}
                    value={[playerState.progress]}
                    onValueChange={(value) => handleVideoProgress(value[0])}
                  />
                </div>
                <Button
                  variant="none"
                  size="icon"
                  className="rounded-full aspect-1 p-0 w-8 h-8"
                  onClick={toggleMute}
                >
                  {!playerState.isMuted ? (
                    <Volume2 className="w-6 h-6 text-white" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-white" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Fade>
      <Fade in={status === "FAILED"} timeout={1000} mountOnEnter unmountOnExit>
        <div className="bg-muted">
          <FileVideo className="absolute inset-0 m-auto w-16 h-16 text-neutral-800" />
        </div>
      </Fade>
    </div>
  );
};

export default VideoAttachment;
