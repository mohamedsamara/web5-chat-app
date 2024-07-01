import { Chat } from "lib/types";
import UserAvatar from "components/UserAvatar";

const ChatHeader = ({ chat }: { chat: Chat }) => {
  return (
    <div className="flex flex-row items-center gap-2 border-b border-b-gray-100 p-2">
      <div>
        <UserAvatar avatar={chat.avatar} alias={chat.name} />
      </div>
      <div>
        <h4>{chat.name || "Dummy"}</h4>
      </div>
    </div>
  );
};

export default ChatHeader;
