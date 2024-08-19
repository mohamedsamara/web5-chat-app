import { useInView } from "react-intersection-observer";

import { Attachment } from "lib/types";
import { useAttachment } from "lib/hooks";
import { cn } from "lib/utils";
import AudioRecording from "./AudioRecording";
import RecordingTimer from "./RecordingTimer";

type Props = {
  className?: string;
  isPreview: boolean;
  attachment: Attachment;
};

const AudioAttachment = ({ className, attachment, isPreview }: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px",
    triggerOnce: true,
  });
  const { url } = useAttachment({
    visible: inView,
    attachment,
  });

  if (isPreview)
    return (
      <div
        ref={ref}
        className="flex items-center gap-1 text-slate-700 text-sm select-none max-w-28"
      >
        <RecordingTimer duration={attachment.duration || 0} />
      </div>
    );

  return (
    <div ref={ref} className={cn(className)}>
      <AudioRecording audio={url} duration={attachment.duration || 0} />
    </div>
  );
};

export default AudioAttachment;
