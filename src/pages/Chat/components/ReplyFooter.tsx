import { X } from "lucide-react";

import { ChatMsg } from "lib/types";
import { useReplyScrollSpy } from "lib/hooks";
import { Button } from "components/ui/button";
import ReplyContent from "./ReplyContent";

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
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-6 w-6"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ReplyFooter;
