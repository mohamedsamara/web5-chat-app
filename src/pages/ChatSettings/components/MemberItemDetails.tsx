import { ChatMember } from "lib/types";
import { useProfile } from "lib/hooks";
import UserAvatar from "components/UserAvatar";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="relative rounded-full aspect-1 p-0 w-8 h-8"
            >
              <UserAvatar src={member.avatar} alias={member.name} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent forceMount>
            <DidDetails className="p-2" did={member.did} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-start items-center flex-1 gap-1">
        <span className="text-md">{member.name}</span>{" "}
        {isMe && <span className="text-slate-500 text-sm">You</span>}
      </div>
    </div>
  );
};

export default MemberItemDetails;
