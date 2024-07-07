import { ChatMsg } from "lib/types";
import MsgText from "./MsgText";

type Props = {
  msg: ChatMsg;
};

const MsgContent = ({ msg }: Props) => {
  switch (msg.type) {
    case "TEXT":
      return <MsgText className="py-2.5" text={msg.text} />;
    default:
      return <></>;
  }
};

export default MsgContent;
