import { useState } from "react";
import { Mic, Trash, Check, Pause, Send } from "lucide-react";

import useAudioRecorder from "lib/hooks/media";
import { useChat } from "lib/hooks";
import { Chat } from "lib/types";
import {
  generateAudioRecordingName,
  getAudioMimeType,
  getTypeOfAttachment,
  isAttachmentTypeAllowed,
} from "lib/utils";
import { Button } from "components/ui/button";
import Loader from "components/Loader";
import AudioRecording from "./AudioRecording";
import RecordingTimer from "./RecordingTimer";

const AudioRecorder = ({ chat }: { chat: Chat }) => {
  const { createAttachmentMsg } = useChat();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    recordingBlob,
    recordingDuration,
    recordingStatus,
    startRecording,
    stopRecording,
    cancelRecording,
    togglePauseResume,
  } = useAudioRecorder();
  const isReadyToUpload = recordingStatus === "STOPPED" && !!recordingBlob;

  const onCreateMsg = async () => {
    try {
      if (!recordingBlob) return;

      const mimeType = getAudioMimeType(recordingBlob.type);
      const isAllowed = isAttachmentTypeAllowed(mimeType);

      if (!isAllowed) return;

      console.log("recordingDuration", recordingDuration);

      setIsSubmitting(true);

      await createAttachmentMsg({
        blob: recordingBlob,
        chat,
        text: "",
        replyUid: "",
        attachment: {
          type: getTypeOfAttachment(recordingBlob.type),
          name: generateAudioRecordingName(recordingBlob.type),
          size: recordingBlob.size,
          mimeType,
          duration: recordingDuration,
        },
      });

      cancelRecording();
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (recordingStatus === "NONE")
    return (
      <Button
        size="sm"
        className="rounded-full aspect-1 p-0 w-8 h-8"
        onClick={startRecording}
      >
        <Mic className="w-4 h-4" />
      </Button>
    );

  return (
    <div className="absolute inset-0 bg-white">
      <div className="flex items-center gap-2 px-4 justify-between h-full">
        <Button
          variant="destructive"
          size="sm"
          className="rounded-full aspect-1 p-0 w-8 h-8"
          onClick={cancelRecording}
          disabled={isSubmitting}
        >
          <Trash className="w-4 h-4" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            {isReadyToUpload && (
              <AudioRecording
                audio={URL.createObjectURL(recordingBlob)}
                duration={recordingDuration}
              />
            )}
            {/* RECORDING | PAUSED */}
            {(recordingStatus === "RECORDING" ||
              recordingStatus === "PAUSED") && (
              <RecordingTimer duration={recordingDuration} />
            )}
          </div>

          {isReadyToUpload ? (
            <Button
              size="sm"
              className="rounded-full aspect-1 p-0 w-8 h-8"
              onClick={onCreateMsg}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader /> : <Send className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="flex items-center gap-2 justify-between">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full aspect-1 p-0 w-8 h-8"
                onClick={togglePauseResume}
              >
                {recordingStatus === "PAUSED" ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                className="rounded-full aspect-1 p-0 w-8 h-8"
                onClick={stopRecording}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
