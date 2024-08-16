import { useEffect } from "react";

import { useChatMembers } from "lib/hooks";
import { Chat } from "lib/types";
import MemberItem from "./MemberItem";
import AddMembers from "./AddMembers";

type Props = {
  chat: Chat;
  canEdit: boolean;
};

const ChatMembers = ({ chat, canEdit }: Props) => {
  const { members, getMembers } = useChatMembers(chat);

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <>
      {canEdit && (
        <div className="text-right">
          <AddMembers chat={chat} members={members} />
        </div>
      )}
      <div className="max-h-[calc(100vh-300px)] overflow-x-hidden overflow-y-auto no-scrollbar">
        {members.map((member) => (
          <MemberItem
            key={member.uid}
            member={member}
            canEdit={canEdit}
            chat={chat}
          />
        ))}
      </div>
    </>
  );
};

export default ChatMembers;
