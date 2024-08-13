import { ChevronLeft, Ellipsis } from "lucide-react";

import { Chat } from "lib/types";
import { Link } from "components/Links";
import UserAvatar from "components/UserAvatar";

const ChatHeader = ({ chat }: { chat: Chat }) => {
  return (
    <div className="border-b border-b-gray-100 p-2 flex items-center justify-between h-12 ">
      <Link className="flex items-center gap-1" to="/chats">
        <ChevronLeft className="h-4 w-4" />
        <div className="flex flex-row items-center gap-2">
          <div>
            <UserAvatar src={chat.avatar} alias={chat.name} />
          </div>
          <div>
            <h4>{chat.name || "Dummy"}</h4>
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
