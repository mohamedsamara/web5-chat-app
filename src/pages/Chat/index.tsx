import { useParams } from "react-router-dom";

import { useChat, useSelectedChat } from "lib/hooks";
import { ChatFooter, ChatHeader, Msgs } from "./components";
import SpinnerOverlay from "components/SpinnerOverlay";
import { EmptyChat } from "./components";

const Chat = () => {
  const { chatId } = useParams();
  const { chatsFetched } = useChat();
  const { chat } = useSelectedChat(chatId ?? "");

  if (!chatsFetched) return <SpinnerOverlay />;
  if (!chat || !chatId) return <EmptyChat />;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <ChatHeader chat={chat} />
      <div className="flex flex-col-reverse flex-1 pb-6 pt-40 overflow-x-hidden overflow-y-auto no-scrollbar">
        <Msgs chat={chat} />
      </div>
      <ChatFooter chat={chat} />
    </div>
  );
};

export default Chat;
