// @ts-ignore
import WaveSurfer from "wavesurfer.js";

import RecordingTimer from "./RecordingTimer";
import { useDimension } from "@/lib/hooks";
import { useRef } from "react";

type Props = {
  mediaRecorder: MediaRecorder;
  duration: number;
};

const AudioRecordingProgress = ({ mediaRecorder, duration }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { width } = useDimension(ref);

  return (
    <div className="flex items-center gap-4">
      <RecordingTimer duration={duration} />
      <div ref={ref} className="flex-1">
        {/* <LiveAudioVisualizer
          mediaRecorder={mediaRecorder}
          width={width - 50}
          height={40}
        /> */}
      </div>
    </div>
  );
};

export default AudioRecordingProgress;
