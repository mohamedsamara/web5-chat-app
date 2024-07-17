import { ChatMsg } from "lib/types";
import MsgText from "./MsgText";
import MsgAttachment from "./MsgAttachment";

type Props = {
  msg: ChatMsg;
};

const MsgContent = ({ msg }: Props) => {
  switch (msg.type) {
    case "TEXT":
      return <MsgText className="p-4" text={msg.text} />;
    case "ATTACHMENT":
      return <MsgAttachment msg={msg} />;
    default:
      return <></>;
  }
};

export default MsgContent;
