import { useEffect } from "react";

import { Chat } from "lib/types";
import { useChat, useChatMsgs } from "lib/hooks";
import SpinnerOverlay from "components/SpinnerOverlay";
import Msg from "./Msg";

const MsgList = ({ chat }: { chat: Chat }) => {
  const { fetchChatMsgs, msgsFetched } = useChat();
  const { msgs } = useChatMsgs(chat);

  useEffect(() => {
    if (!chat) return;
    fetchChatMsgs(chat.recordId);
  }, [chat.uid]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      fetchChatMsgs(chat.recordId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [chat.uid]);

  if (!msgsFetched) return <SpinnerOverlay />;

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
