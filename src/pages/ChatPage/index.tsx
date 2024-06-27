import { useParams } from "react-router-dom";

import { ChatFooter, ChatHeader, MsgList } from "./components";
import { useSelectedChat } from "@/lib/hooks";

const ChatPage = () => {
  const { chatId } = useParams();
  const { chat } = useSelectedChat(chatId ?? "");
  if (!chat || !chatId) return null;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <ChatHeader chat={chat} />

      <div className="flex flex-col-reverse flex-1 py-6 overflow-x-hidden overflow-y-auto no-scrollbar">
        <MsgList chat={chat} />
      </div>
      <ChatFooter chat={chat} />
    </div>
  );
};

export default ChatPage;
