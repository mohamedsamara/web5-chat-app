import RecordingTimer from "./RecordingTimer";

type Props = {
  mediaRecorder: MediaRecorder;
  duration: number;
};

const AudioRecordingProgress = ({ duration }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <RecordingTimer duration={duration} />
    </div>
  );
};

export default AudioRecordingProgress;
