import { cn, getMemoizedRandomColors } from "lib/utils";
import { ChatMsg } from "lib/types";
import { useReplyMsg } from "lib/hooks";
import MsgText from "./MsgText";
import AttachementContent from "./AttachementContent";

type Props = {
  className?: string;
  contentStyles?: string;
  isReply?: boolean;
  isPreview?: boolean;
  msg: ChatMsg;
  onClick: (uid: string) => void;
};

const ReplyContent = ({
  className,
  contentStyles,
  isReply = false,
  msg,
  onClick,
}: Props) => {
  const color = getMemoizedRandomColors(msg.sender.name);
  const name = msg.isMe ? "You" : msg.sender.name;

  return (
    <div
      className={cn("flex justify-start text-left cursor-pointer", className)}
      onClick={() => onClick(msg.uid)}
    >
      <div
        className={cn(
          "flex flex-col gap-1 w-full px-2 border-l-4 pt-1 pb-2",
          contentStyles
        )}
        style={{ borderLeftColor: color }}
      >
        <span className="text-sm" style={{ color }}>
          {name}
        </span>
        <ReplyContentType msg={msg} isReply={isReply} />
      </div>
    </div>
  );
};

export default ReplyContent;

const ReplyContentType = ({
  isReply,
  msg,
}: {
  msg: ChatMsg;
  isReply: boolean;
}) => {
  const reply = useReplyMsg(msg, isReply);

  switch (msg.type) {
    case "TEXT":
      return <MsgText className="truncate" text={msg.text} />;
    case "ATTACHMENT":
      if (!msg.attachment) return <></>;
      return (
        <div className="flex items-center justify-between gap-2">
          <AttachementContent
            isPreview
            attachment={msg.attachment}
            className={cn(
              "rounded-md overflow-hidden aspect-square",
              isReply && !reply.text ? "w-full" : "w-16"
            )}
          />
          <div className="flex-1 min-w-0">
            {reply.text && (
              <MsgText className="truncate capitalize" text={msg.text} />
            )}
          </div>
        </div>
      );
    default:
      return <></>;
  }
};
