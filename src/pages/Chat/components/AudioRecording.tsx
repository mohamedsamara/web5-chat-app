import { useRef } from "react";
import { Pause, Play } from "lucide-react";
import { useWavesurfer } from "@wavesurfer/react";

import { Button } from "components/ui/button";
import RecordingTimer from "./RecordingTimer";

type Props = {
  audio: string;
  duration: number;
};

const AudioRecording = ({ audio, duration }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    url: audio,
    height: 25,
    barWidth: 2,
    barHeight: 10,
    cursorWidth: 0,
  });

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="none"
        size="sm"
        className="rounded-full aspect-1 p-0 w-8 h-8"
        onClick={onPlayPause}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <RecordingTimer duration={duration} />
      <div className="flex-1">
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default AudioRecording;
