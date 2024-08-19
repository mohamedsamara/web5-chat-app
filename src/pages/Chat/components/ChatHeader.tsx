import { ChevronLeft, Ellipsis } from "lucide-react";

import { Chat } from "lib/types";
import { Link } from "components/Links";
import UserAvatar from "components/UserAvatar";
import { ChatName } from "pages/Chats/components";

const ChatHeader = ({ chat }: { chat: Chat }) => {
  const isGroup = chat.type === "GROUP";

  return (
    <div className="border-b border-b-slate-100 p-2 flex items-center justify-between h-14">
      <Link className="flex items-center gap-1" to="/chats">
        <ChevronLeft className="h-4 w-4" />
        <div className="flex flex-row items-center gap-3">
          <div>
            <UserAvatar src={chat.avatar} alias={chat.name} />
          </div>
          <div className="flex flex-col gap-1">
            <ChatName name={chat.name} />
            {isGroup && (
              <span className="text-xs text-slate-500">
                {chat.memberDids.length} members
              </span>
            )}
          </div>
        </div>
      </Link>

      <Link
        className="hover:bg-accent hover:text-accent-foreground p-2 rounded-full"
        to={`/chats/${chat.uid}/settings`}
      >
        <Ellipsis className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ChatHeader;
