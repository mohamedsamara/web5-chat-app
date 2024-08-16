import { useEffect } from "react";

import { useChat, useChatsLastMsgPolling } from "lib/hooks";
import SpinnerOverlay from "components/SpinnerOverlay";
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
          <p className="text-sm text-gray-600">
            Start a conversation or group chat
          </p>
        </div>
      )}
    </>
  );
};

export default ChatList;
