import { Chat } from "lib/types";
import UserAvatar from "components/UserAvatar";

const ChatSettingsHeader = ({ chat }: { chat: Chat }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <UserAvatar size="3xl" src={chat.avatar} alias={chat.name} />
      <h4>{chat.name || "Dummy"}</h4>
    </div>
  );
};

export default ChatSettingsHeader;
