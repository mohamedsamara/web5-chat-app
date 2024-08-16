import EE, { REPLY_MSG } from "lib/ee";
import { ChatMsg } from "lib/types";
import ForwardIcon from "assets/forward.svg";
import { Button } from "components/ui/button";

type Props = {
  msg: ChatMsg;
};

const MsgActions = ({ msg }: Props) => {
  const onReply = () => EE.emit(REPLY_MSG, msg);

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full aspect-1 p-0 w-8 h-8"
        onClick={onReply}
      >
        <img
          draggable={false}
          src={ForwardIcon}
          alt="Forward Icon"
          className="w-6 h-6 select-none"
        />
      </Button>
    </div>
  );
};

export default MsgActions;
