import { format } from "date-fns";

import { ChatMsg } from "lib/types";
import ChatBubble from "components/ChatBubble";

type Props = {
  msg: ChatMsg;
};

const Msg = ({ msg }: Props) => {
  const msgTime = format(msg.createdAt, "p");

  return (
    <ChatBubble
      end={msg.isMe}
      showName={!msg.isMe && msg.showInfoBar}
      noStyles={!msg.showInfoBar}
      showAvatar={msg.showInfoBar}
      avatar={msg.sender.avatar}
      name={msg?.sender?.name}
      text={msg.content}
      time={msgTime}
    />
  );
};

export default Msg;
