import { useState } from "react";
import { format } from "date-fns";
import { useSwipeable } from "react-swipeable";

import EE, { REPLY_MSG } from "lib/ee";
import { ChatMsg } from "lib/types";
import ChatBubble from "components/ChatBubble";
import MsgContent from "./MsgContent";
import ReplyContent from "./ReplyContent";

type Props = {
  msg: ChatMsg;
  isHighlighted: boolean;
  onReplyClick: (uid: string) => void;
};

const Msg = ({ msg, isHighlighted, onReplyClick }: Props) => {
  const msgTime = format(msg.createdAt, "p");
  const [swiping, setSwiping] = useState(false);
  const [deltaX, setDeltaX] = useState(0);
  /* This is a workaround swipe functionality */
  const handlers = useSwipeable({
    trackMouse: true,
    onSwiping: (eventData) => {
      setSwiping(true);
      if (msg.isMe) {
        if (eventData.deltaX > -80 && eventData.deltaX < 0) {
          setDeltaX(eventData.deltaX);
        }
      } else {
        if (eventData.deltaX > 0 && eventData.deltaX < 80) {
          setDeltaX(eventData.deltaX);
        }
      }
    },
    onSwiped: () => {
      setTimeout(() => setSwiping(false), 500);
      setDeltaX(0);
      if (deltaX !== 0) {
        EE.emit(REPLY_MSG, msg);
      }
    },
  });

  const _onReplyClick = (uid: string) => {
    if (swiping) return;
    onReplyClick(uid);
  };

  return (
    <div
      className="transition-all"
      {...handlers}
      style={{
        transform: `translate(${deltaX}px)`,
      }}
    >
      <ChatBubble
        showForward={deltaX !== 0}
        bubbleStyles={isHighlighted ? "animate-bg-pulse" : ""}
        end={msg.isMe}
        showName={!msg.isMe && msg.showInfoBar}
        noStyles={!msg.showInfoBar}
        showAvatar={msg.showInfoBar}
        avatar={msg.sender.avatar}
        name={msg?.sender?.name}
        time={msgTime}
      >
        {msg.reply && (
          <ReplyContent
            className="bg-slate-50 text-black rounded-tr-md rounded-br-md"
            msg={msg.reply}
            onClick={_onReplyClick}
          />
        )}

        <MsgContent msg={msg} />
      </ChatBubble>
    </div>
  );
};

export default Msg;
