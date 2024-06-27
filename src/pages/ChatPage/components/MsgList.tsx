import { Chat } from "lib/types";
import { useChat } from "lib/hooks";
import { useEffect } from "react";
import Msg from "./Msg";

const MsgList = ({ chat }: { chat: Chat }) => {
  const { chatMsgs, fetchChatMsgs } = useChat();

  useEffect(() => {
    fetchChatMsgs(chat.recordId);
  }, [chat.uid]);

  return (
    <div>
      {chatMsgs.map((msg) => (
        <div key={msg.uid} className="mb-3">
          <Msg msg={msg} />
        </div>
      ))}
    </div>
  );
};

export default MsgList;
