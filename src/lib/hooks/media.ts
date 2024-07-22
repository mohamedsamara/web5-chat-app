/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  RefObject,
  ChangeEvent,
} from "react";

import { AttachmentDisplayStatus, AudioRecordingStatus } from "lib/types";
import { isSafari } from "lib/utils";

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

export interface AudioRecorderProps {
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  togglePauseResume: () => void;
  recordingBlob: Blob | null;
  recordingDuration: number;
  mediaRecorder: MediaRecorder | null;
  recordingStatus: AudioRecordingStatus;
}

type MediaAudioTrackConstraints = Pick<
  MediaTrackConstraints,
  | "deviceId"
  | "groupId"
  | "autoGainControl"
  | "channelCount"
  | "echoCancellation"
  | "noiseSuppression"
  | "sampleRate"
  | "sampleSize"
>;

type MediaAudioRecorderOptions = Pick<
  MediaRecorderOptions,
  "audioBitsPerSecond" | "bitsPerSecond" | "videoBitsPerSecond"
>;

const RECORDED_MIME_TYPE_BY_BROWSER = {
  audio: {
    others: "audio/webm",
    safari: "audio/mp4;codecs=mp4a.40.2",
  },
} as const;

const useAudioRecorder = ({
  audioTrackConstraints,
  mediaRecorderOptions,
}: {
  audioTrackConstraints?: MediaAudioTrackConstraints;
  mediaRecorderOptions?: MediaAudioRecorderOptions;
} = {}) => {
  const timerRef = useRef<NodeJS.Timeout>();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingStatus, setRecordingStatus] =
    useState<AudioRecordingStatus>("NONE");

  const startTimer: () => void = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingDuration((time) => time + 1);
    }, 1000);
  }, [timerRef, setRecordingDuration]);

  const stopTimer: () => void = useCallback(() => {
    // if(timerRef.current)
    clearInterval(timerRef.current);
  }, [timerRef]);

  const startRecording = useCallback(() => {
    // if (timerRef.current) return;

    navigator.mediaDevices
      .getUserMedia({ audio: audioTrackConstraints ?? true })
      .then((stream) => {
        setRecordingStatus("RECORDING");

        const recorder: MediaRecorder = new MediaRecorder(stream, {
          ...mediaRecorderOptions,
          mimeType: isSafari()
            ? RECORDED_MIME_TYPE_BY_BROWSER.audio.safari
            : RECORDED_MIME_TYPE_BY_BROWSER.audio.others,
        });
        setMediaRecorder(recorder);
        recorder.start();
        startTimer();

        recorder.addEventListener("dataavailable", (event) => {
          if (!event.data.size) return;

          setRecordingBlob(event.data);
          recorder.stream.getTracks().forEach((t) => t.stop());
          setMediaRecorder(null);
        });
      });
  }, [
    timerRef,
    setRecordingStatus,
    setMediaRecorder,
    startTimer,
    setRecordingBlob,
    mediaRecorderOptions,
  ]);

  const stopRecording = useCallback(() => {
    setRecordingStatus("STOPPED");
    mediaRecorder?.stop();
    stopTimer();
  }, [mediaRecorder, setRecordingStatus, stopTimer]);

  const cancelRecording = useCallback(() => {
    setRecordingStatus("NONE");
    mediaRecorder?.stop();
    stopTimer();
    setRecordingDuration(0);
  }, [mediaRecorder, setRecordingDuration, setRecordingStatus, stopTimer]);

  const togglePauseResume = useCallback(() => {
    if (recordingStatus === "PAUSED") {
      setRecordingStatus("RECORDING");
      mediaRecorder?.resume();
      startTimer();
    } else {
      setRecordingStatus("PAUSED");
      stopTimer();
      mediaRecorder?.pause();
    }
  }, [recordingStatus, mediaRecorder, startTimer, stopTimer]);

  return {
    recordingStatus,
    startRecording,
    stopRecording,
    togglePauseResume,
    cancelRecording,

    recordingDuration,
    recordingBlob,
    mediaRecorder,
  };
};

export default useAudioRecorder;
