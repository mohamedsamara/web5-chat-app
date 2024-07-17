import { useState, useRef, ChangeEvent } from "react";
import { Plus, FileImage, FileVideo, Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useChat } from "lib/hooks";
import { Chat, MsgAttachmentType } from "lib/types";
import { getTypeOfAttachment, isAttachmentTypeAllowed } from "lib/utils";
import { Button } from "components/ui/button";
import Dialog from "components/Dialog";
import Loader from "components/Loader";

const AttachmentUploader = ({ chat }: { chat: Chat }) => {
  const { createAttachmentMsg } = useChat();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const onModalOpen = () => setModalOpen(true);
  const onModalClose = () => setModalOpen(false);

  const onClick = () => {
    hiddenFileInput.current?.click();
  };

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  const _onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const attachment = event.target?.files?.[0] as File;
    const isAllowed = isAttachmentTypeAllowed(attachment.type);

    if (!isAllowed) {
      // TODO: Show feedback UI
      return;
    }

    if (attachment.size > 1048576) {
      console.log("exceeds 1 MB");

      return;
    }

    setAttachment(attachment);
    event.target.value = "";
  };

  const onCreateMsg = async () => {
    try {
      if (!attachment) return;
      setIsSubmitting(true);

      const blob = new Blob([attachment], { type: attachment.type });
      const attachmentType = getTypeOfAttachment(attachment.type);

      await createAttachmentMsg({
        blob,
        chat,
        text: caption,
        replyUid: "",
        attachmentType,
      });

      setAttachment(null);
      setCaption("");
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsSubmitting(false);
      onModalClose();
    }
  };

  return (
    <Dialog
      title="Share photos and videos"
      open={modalOpen}
      onOpenChange={setModalOpen}
      onClose={onModalClose}
      trigger={
        <Button
          size="icon"
          className="relative rounded-full aspect-1 p-0 w-8 h-8"
          onClick={onModalOpen}
        >
          <Plus className="w-4 h-4" />
        </Button>
      }
    >
      <div className="flex flex-col h-[calc(100vh-170px)] lg:h-[calc(100vh-250px)]">
        <div className="flex flex-col justify-center flex-1 mx-auto">
          {attachment ? (
            <div className="rounded-md max-w-screen-md max-h-96 overflow-hidden">
              <AttchementContentType
                type={getTypeOfAttachment(attachment.type)}
                url={URL.createObjectURL(attachment)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <FileImage className="w-16 h-16" />
              <FileVideo className="w-16 h-16 -rotate-12" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-10">
          <Button onClick={onClick}>Choose photo or video</Button>
          <div className="flex gap-3">
            <TextareaAutosize
              className="self-center w-full p-2 px-3 py-2 transition-all border border-input bg-background rounded-md ring-offset-background resize-none placeholder:text-muted-foreground focus:outline-none focus:shadow-outline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 no-scrollbar"
              placeholder="Add caption..."
              maxRows={10}
              onChange={onTextChange}
              value={caption}
            />

            <div className="self-end py-2">
              <Button
                size="sm"
                className="rounded-full aspect-1 p-0 w-8 h-8"
                onClick={onCreateMsg}
                disabled={isSubmitting || !attachment}
              >
                {isSubmitting ? <Loader /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <input
          type="file"
          accept="image/*, video/*"
          // accept=".pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ref={hiddenFileInput}
          onChange={_onChange}
          style={{ display: "none" }}
        />
      </div>
    </Dialog>
  );
};

export default AttachmentUploader;

const AttchementContentType = ({
  type,
  url,
}: {
  type: MsgAttachmentType;
  url: string;
}) => {
  switch (type) {
    case "IMAGE":
      return <img src={url} />;
    case "VIDEO":
      return (
        <video>
          <source src={url} />
        </video>
      );
    default:
      return <></>;
  }
};
