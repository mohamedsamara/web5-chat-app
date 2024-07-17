import { useAttachmentViewer, useIsMsgSwiping } from "lib/hooks";
import { Attachment, ChatMsg } from "lib/types";
import MsgText from "./MsgText";
import EmptyAttachment from "./EmptyAttachment";
import AttachementContent from "./AttachementContent";

type ExtraProps = {
  className?: string;
};

type Props = ExtraProps & {
  msg: ChatMsg;
};

const MsgAttachment = ({ msg, ...rest }: Props) => {
  return (
    <>
      {!msg.attachment ? (
        <EmptyAttachment
          className={msg.text.length > 0 ? "pt-4 px-3" : "p-3"}
        />
      ) : (
        <MsgAttachmentDisplay
          caption={msg.text}
          attachment={msg.attachment}
          {...rest}
        />
      )}
    </>
  );
};

export default MsgAttachment;

type MsgAttachmentDisplayProps = ExtraProps & {
  caption: string;
  attachment: Attachment;
};

const MsgAttachmentDisplay = ({
  caption,
  attachment,
}: MsgAttachmentDisplayProps) => {
  const { isMsgSwiping } = useIsMsgSwiping();
  const { openViewer } = useAttachmentViewer();

  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        if (isMsgSwiping) return;
        openViewer({ caption, attachment });
      }}
    >
      <AttachementContent attachment={attachment} isPreview={true} />
      {caption && <MsgText className="p-3" text={caption} />}
    </div>
  );
};
