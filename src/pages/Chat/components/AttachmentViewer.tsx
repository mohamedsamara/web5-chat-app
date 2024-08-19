import { format } from "date-fns";

import { useAttachmentViewer } from "lib/hooks";
import Modal from "components/Modal";
import UserAvatar from "components/UserAvatar";
import MsgText from "./MsgText";
import AttachementContent from "./AttachementContent";

const AttachmentViewer = () => {
  const { attachmentViewer, closeViewer } = useAttachmentViewer();
  if (!attachmentViewer.visible || !attachmentViewer.params?.attachment)
    return null;
  const { attachment, sender, text, createdAt, isMe } = attachmentViewer.params;
  const msgTime = format(createdAt, "PPPPp");
  const name = isMe ? "You" : sender.name;

  return (
    <Modal
      visible={attachmentViewer.visible}
      onClose={() => {
        closeViewer();
      }}
    >
      <AttachementContent
        className="rounded-md aspect-auto"
        caption={text}
        attachment={attachment}
        autoPlay
      />
      <div className="absolute bottom-0 right-0 left-0 flex flex-col gap-4 pb-8 pt-4 px-6 bg-black/50">
        <div className="max-h-[90px] overflow-x-hidden overflow-y-auto no-scrollbar">
          {text && (
            <MsgText className="text-white" text={text} isShortPreview />
          )}
        </div>
        <div className="flex gap-2 items-center">
          <UserAvatar src={sender.avatar} alias={sender.name} />
          <div>
            <p className="text-xs font-normal text-slate-200">{name}</p>
            <p className="text-xs font-normal text-slate-400">Sent {msgTime}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttachmentViewer;
