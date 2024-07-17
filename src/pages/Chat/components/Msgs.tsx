import { useEffect } from "react";

import { Chat } from "lib/types";
import { useChat, useChatMsgs } from "lib/hooks";
import SpinnerOverlay from "components/SpinnerOverlay";
import MsgList from "./MsgList";

const Msgs = ({ chat }: { chat: Chat }) => {
  const { msgsFetched, fetchChatMsgs } = useChat();
  const { msgs } = useChatMsgs(chat.uid);
  // console.log("msgs", msgs);

  useEffect(() => {
    if (!chat) return;
    fetchChatMsgs(chat.recordId);
  }, [chat.uid]);

  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     fetchChatMsgs(chat.recordId);
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, [chat.uid]);

  if (!msgsFetched) return <SpinnerOverlay />;

  return <MsgList msgs={msgs} />;
};

export default Msgs;
