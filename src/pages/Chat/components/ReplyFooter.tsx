import { ChatMsg } from "lib/types";
import { useReplyScrollSpy } from "lib/hooks";
import ReplyContent from "./ReplyContent";
import { CloseButton } from "@/components/Buttons";

type Props = {
  msg: ChatMsg;
  onClose: () => void;
};

const ReplyFooter = ({ msg, onClose }: Props) => {
  const { scrollToMsg } = useReplyScrollSpy();

  return (
    <div className="flex items-center justify-between gap-2 pr-2 border-t border-t-gray-200">
      <div className="flex-1 min-w-0">
        <ReplyContent msg={msg} onClick={scrollToMsg} />
      </div>
      <CloseButton variant="ghost" onClick={onClose} />
    </div>
  );
};

export default ReplyFooter;
