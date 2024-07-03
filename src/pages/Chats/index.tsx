import { memo } from "react";
import { Outlet, useMatch } from "react-router-dom";

import { cn } from "lib/utils";
import { ChatList, ChatsHeader } from "./components";

export const MemoizedChatsHeader = memo(ChatsHeader);
export const MemoizedChatList = memo(ChatList);

const Chats = () => {
  const isChatSubroute = useMatch({
    path: "chats/*",
  })?.params["*"]
    ? true
    : false;

  return (
    <main className="flex flex-col lg:flex-row overflow-hidden h-full">
      <aside className="min-w-[310px] border-r border-r-gray-100">
        <MemoizedChatsHeader />
        <div className="overflow-y-auto no-scrollbar h-[calc(100vh_-3.5rem)]">
          <MemoizedChatList />
        </div>
      </aside>
      <div className="flex-1">
        <div
          className={cn(
            "flex-1 h-full w-full fixed top-0 bottom-0 bg-white lg:static transition-all duration-500 ease-in-out",
            isChatSubroute ? "right-0" : "-right-full"
          )}
        >
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Chats;
