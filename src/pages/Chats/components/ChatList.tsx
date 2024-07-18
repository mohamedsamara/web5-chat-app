import { useEffect } from "react";

import { useChat, useChatsLastMsgPolling } from "lib/hooks";
import SpinnerOverlay from "components/SpinnerOverlay";
import CreateConversation from "./CreateConversation";
import ChatItem from "./ChatItem";

const ChatList = () => {
  const { chats, fetchChats, chatsFetched } = useChat();
  useChatsLastMsgPolling();

  useEffect(() => {
    fetchChats();
  }, []);

  if (!chatsFetched) return <SpinnerOverlay />;

  return (
    <>
      {chats.length > 0 ? (
        <nav>
          <ul>
            {chats.map((chat) => (
              <li key={chat.uid}>
                <ChatItem chat={chat} />
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <div className="flex h-full justify-center items-center">
          <CreateConversation btnType="full" />
        </div>
      )}
    </>
  );
};

export default ChatList;
