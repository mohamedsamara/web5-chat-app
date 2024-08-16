import { ChatMember } from "lib/types";
import { useProfile } from "lib/hooks";
import UserAvatar from "components/UserAvatar";

type Props = {
  member: ChatMember;
};

const MemberItemDetails = ({ member }: Props) => {
  const { profile } = useProfile();
  const isMe = profile.did === member.did;

  return (
    <div className="flex items-center gap-2">
      <div className="flex justify-start overflow-hidden">
        <UserAvatar src={member.avatar} alias={member.name} />
      </div>
      <div className="flex justify-start items-center flex-1 gap-1">
        <span className="text-md">{member.name}</span>{" "}
        {isMe && <span className="text-gray-500 text-sm">You</span>}
      </div>
    </div>
  );
};

export default MemberItemDetails;
