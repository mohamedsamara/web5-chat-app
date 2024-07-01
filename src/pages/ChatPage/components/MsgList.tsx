import { Chat } from "lib/types";
import { useChat, useChatMsgs } from "lib/hooks";
import { useEffect } from "react";
import Msg from "./Msg";

const MsgList = ({ chat }: { chat: Chat }) => {
  const { fetchChatMsgs } = useChat();
  const { msgs } = useChatMsgs(chat);

  useEffect(() => {
    fetchChatMsgs(chat.recordId);
  }, [chat.uid]);

  return (
    <div>
      {msgs.map((msg) => (
        <div key={msg.uid} className="mb-3">
          <Msg msg={msg} />
        </div>
      ))}
    </div>
  );
};

export default MsgList;
