import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useChat } from "lib/hooks";
import UserAvatar from "components/UserAvatar";
import SpinnerOverlay from "components/SpinnerOverlay";
import CreateConversation from "./CreateConversation";

const ChatList = () => {
  const { chats, fetchChats, chatsFetched } = useChat();
  // console.log("chats", chats);

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
                    <UserAvatar src={chat.avatar} alias={chat.name} />
                    <h4>{chat.name || "Dummy"}</h4>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <div className="flex h-full justify-center items-center">
          <CreateConversation btnType="full" />
        </div>
      )}
    </>
  );
};

export default ChatList;
