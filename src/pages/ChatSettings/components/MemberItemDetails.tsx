import { ChatMember } from "lib/types";
import { useProfile } from "lib/hooks";
import UserAvatar from "components/UserAvatar";
import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import DidDetails from "./DidDetails";

type Props = {
  member: ChatMember;
};

const MemberItemDetails = ({ member }: Props) => {
  const { profile } = useProfile();
  const isMe = profile.did === member.did;

  return (
    <div className="flex items-center gap-2">
      <div className="flex justify-start overflow-hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="relative w-8 h-8 p-0 rounded-full aspect-1"
            >
              <UserAvatar src={member.avatar} alias={member.name} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <DidDetails className="p-2" did={member.did} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center justify-start flex-1 gap-1">
        <span className="text-md">{member.name}</span>{" "}
        {isMe && <span className="text-sm text-slate-500">You</span>}
      </div>
    </div>
  );
};

export default MemberItemDetails;
