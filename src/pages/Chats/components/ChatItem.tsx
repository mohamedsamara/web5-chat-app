import { NavLink } from "react-router-dom";
import { format } from "date-fns";

import { Chat, LastMsg } from "lib/types";
import { useMsgText } from "lib/hooks";
import UserAvatar from "components/UserAvatar";

const ChatItem = ({ chat }: { chat: Chat }) => {
  const { lastMsg } = chat;
  const lastMsgSentAt = lastMsg ? format(lastMsg.msg.createdAt, "p") : null;

  return (
    <NavLink
      to={`${chat.uid}`}
      className={({ isActive }) =>
        [
          "p-2 block mb-2",
          isActive ? "bg-muted hover:bg-muted" : "hover:bg-muted",
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex justify-start basis-8 overflow-hidden">
          <UserAvatar src={chat.avatar} alias={chat.name} />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0 overflow-hidden pl-1 gap-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <h4>{chat.name || "Dummy"}</h4>
            </div>
            {chat.lastMsg && (
              <span className="text-xs text-gray-500">{lastMsgSentAt}</span>
            )}
          </div>
          {/* Last msg */}
          {lastMsg && <LastMsgContent lastMsg={lastMsg} />}
        </div>
      </div>
    </NavLink>
  );
};

export default ChatItem;

const LastMsgContent = ({ lastMsg }: { lastMsg: LastMsg }) => {
  const msgText = useMsgText(lastMsg.msg);

  return (
    <div className="flex items-center justify-between w-full">
      <p className="truncate capitalize text-sm text-gray-500 max-w-[85%]">
        {msgText}
      </p>
    </div>
  );
};
