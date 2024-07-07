import { ChatMsg } from "lib/types";
import { useReplyScrollSpy } from "lib/hooks";

import Msg from "./Msg";

const MsgList = ({ msgs }: { msgs: ChatMsg[] }) => {
  const { scrollToMsg, reply } = useReplyScrollSpy();

  return (
    <div>
      {msgs.map((msg) => (
        <div key={msg.uid} className="mb-3" id={`msg-${msg.uid}`}>
          <Msg
            msg={msg}
            isHighlighted={msg.uid === reply.uid && reply.visible}
            onReplyClick={scrollToMsg}
          />
        </div>
      ))}
    </div>
  );
};

export default MsgList;
