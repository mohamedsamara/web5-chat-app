import { cn, getMemoizedRandomColors } from "lib/utils";
import { ChatMsg } from "lib/types";
import { Button } from "components/ui/button";
import MsgText from "./MsgText";

type Props = {
  className?: string;
  msg: ChatMsg;
  onClick: (uid: string) => void;
};

const ReplyContent = ({ className, msg, onClick }: Props) => {
  const color = getMemoizedRandomColors(msg.sender.name);
  const name = msg.isMe ? "You" : msg.sender.name;

  return (
    <Button
      variant="none"
      className="flex w-full h-auto flex justify-start text-left p-0"
      onClick={() => onClick(msg.uid)}
    >
      <div
        className={cn("grid gap-1 w-full px-2 border-l-4 pt-1 pb-2", className)}
        style={{ borderLeftColor: color }}
      >
        <span className="text-sm" style={{ color }}>
          {name}
        </span>
        <MsgText className="truncate" text={msg.text} />
      </div>
    </Button>
  );
};

export default ReplyContent;
