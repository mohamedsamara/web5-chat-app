import { NavLink } from "react-router-dom";

import { Chat } from "lib/types";
import UserAvatar from "components/UserAvatar";

const ChatList = ({ chats }: { chats: Chat[] }) => {
  return (
    <nav>
      <ul>
        {chats.map((chat, idx) => (
          <li key={idx} className="">
            <NavLink
              to={`chats/${chat.uid}`}
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
                <UserAvatar avatar={chat.avatar} alias={chat.name} />
                <h4>{chat.name || "Dummy"}</h4>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ChatList;
