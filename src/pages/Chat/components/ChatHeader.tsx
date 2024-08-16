import { ChevronLeft, Ellipsis } from "lucide-react";

import { Chat } from "lib/types";
import { Link } from "components/Links";
import UserAvatar from "components/UserAvatar";

const ChatHeader = ({ chat }: { chat: Chat }) => {
  const isGroup = chat.type === "GROUP";

  return (
    <div className="border-b border-b-gray-100 p-2 flex items-center justify-between h-14">
      <Link className="flex items-center gap-1" to="/chats">
        <ChevronLeft className="h-4 w-4" />
        <div className="flex flex-row items-center gap-3">
          <div>
            <UserAvatar src={chat.avatar} alias={chat.name} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm leading-4">{chat.name || "Dummy"}</h4>

            {isGroup && (
              <span className="text-xs text-gray-500">
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
