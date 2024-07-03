import { useState, ChangeEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Loader2, Send } from "lucide-react";

import { Chat } from "lib/types";
import { useChat } from "lib/hooks";
import { Button } from "components/ui/button";

const ChatFooter = ({ chat }: { chat: Chat }) => {
  const { createMsg } = useChat();
  const [msg, setMsg] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  const onCreateMsg = async () => {
    try {
      setSendLoading(true);

      await createMsg({
        chat,
        content: msg.trim(),
      });
      setMsg("");
    } catch (error) {
      console.log("error");
    } finally {
      setSendLoading(false);
    }
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value);
  };

  const isSendBtnDisabled = msg.trim().length === 0 || sendLoading;

  return (
    <div className="flex gap-3 px-4 py-[2.5px] border-t border-t-gray-200 bg-white w-full">
      <TextareaAutosize
        className="self-center w-full p-2 px-3 py-2 transition-all border-none resize-none focus:outline-none focus:shadow-outline no-scrollbar"
        placeholder="Type..."
        maxRows={10}
        onChange={onChange}
        value={msg}
        // ref={msgRef}
        // onFocus={scrollToBottom}
      />
      <div className="self-end py-2">
        <Button size="sm" onClick={onCreateMsg} disabled={isSendBtnDisabled}>
          {sendLoading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatFooter;
