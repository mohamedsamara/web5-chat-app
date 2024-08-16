import { format } from "date-fns";

import { ChatMsg } from "lib/types";
import ChatBubble from "./ChatBubble";
import MsgContent from "./MsgContent";
import ReplyContent from "./ReplyContent";
import MsgActions from "./MsgActions";

type Props = {
  msg: ChatMsg;
  isHighlighted: boolean;
  onReplyClick: (uid: string) => void;
};

const Msg = ({ msg, isHighlighted, onReplyClick }: Props) => {
  const msgTime = format(msg.createdAt, "p");

  return (
    <ChatBubble
      bubbleStyles={isHighlighted ? "animate-bg-pulse" : ""}
      end={msg.isMe}
      showName={!msg.isMe && msg.showInfoBar}
      noStyles={!msg.showInfoBar}
      showAvatar={msg.showInfoBar}
      avatar={msg.sender.avatar}
      name={msg?.sender?.name}
      time={msgTime}
      actions={<MsgActions msg={msg} />}
    >
      {msg.reply && (
        <ReplyContent
          className="px-4 pt-4"
          contentStyles="bg-slate-50 text-black rounded-tr-lg rounded-br-lg"
          msg={msg.reply}
          onClick={onReplyClick}
          isReply
        />
      )}
      <MsgContent msg={msg} />
    </ChatBubble>
  );
};

export default Msg;
