import { useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useChat, useProfile, useSelectedChat } from "lib/hooks";
import { ChatSettingsHeader, ChatTabs } from "./components";
import SpinnerOverlay from "components/SpinnerOverlay";
import { Link } from "components/Links";
import { EmptyChat } from "../Chat/components";

const ChatSettings = () => {
  const { chatUid } = useParams();
  const { profile } = useProfile();
  const { chatsFetched } = useChat();
  const { chat } = useSelectedChat(chatUid ?? "");

  if (!chatsFetched) return <SpinnerOverlay />;

  if (!chat || !chatUid) return <EmptyChat />;

  const isGroupChat = chat.type === "GROUP";
  const isOwner = chat.ownerDid === profile.did;
  const canEdit = isOwner && isGroupChat;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center px-3 border-b border-b-gray-100 h-12">
        <Link className="flex items-center gap-1" to={`/chats/${chat.uid}`}>
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 gap-10 py-12 px-6 overflow-hidden w-full max-w-md mx-auto">
        <ChatSettingsHeader chat={chat} canEdit={canEdit} />
        <ChatTabs chat={chat} canEdit={canEdit} />
      </div>
    </div>
  );
};

export default ChatSettings;
