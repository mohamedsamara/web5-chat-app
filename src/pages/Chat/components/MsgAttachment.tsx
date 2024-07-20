import { useIsPreviewAttachment } from "lib/hooks";
import { Attachment, ChatMsg } from "lib/types";
import MsgText from "./MsgText";
import EmptyAttachment from "./EmptyAttachment";
import AttachementContent from "./AttachementContent";
import MsgAttachmentAnchor from "./MsgAttachmentAnchor";

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
  const { isPreview } = useIsPreviewAttachment(attachment.type);

  return (
    <div>
      <MsgAttachmentAnchor attachment={attachment} caption={caption}>
        <AttachementContent
          caption={caption}
          attachment={attachment}
          isPreview={isPreview}
        />
      </MsgAttachmentAnchor>
      {caption && <MsgText className="p-3" text={caption} />}
    </div>
  );
};
