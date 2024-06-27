import { Outlet } from "react-router-dom";

import { useChat } from "lib/hooks";
import { ChatList, ChatsHeader } from "./components";
import { useEffect } from "react";

const Root = () => {
  const { chats, fetchChats } = useChat();

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <main className="flex flex-row h-full">
      <aside className="min-w-[310px] border-r border-r-gray-100">
        <ChatsHeader />
        <ChatList chats={chats} />
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};

export default Root;
