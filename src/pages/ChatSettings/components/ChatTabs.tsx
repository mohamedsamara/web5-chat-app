import { useEffect } from "react";
import { format } from "date-fns";

import {
  AttachmentViewerParams,
  Chat,
  ChatAttachmentMsgsFilterType,
} from "lib/types";
import { cn } from "lib/utils";
import {
  useAttachmentViewer,
  useChatAttachments,
  useFilteredChatAttachmentMsgs,
} from "lib/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { BareButton } from "components/Buttons";
import { AttachementContent } from "@/pages/Chat/components";
import ChatMembers from "./ChatMembers";

type Props = {
  chat: Chat;
  canEdit: boolean;
};

const ChatTabs = ({ chat, canEdit }: Props) => {
  const { fetchChatAttachments } = useChatAttachments();
  const { openViewer } = useAttachmentViewer();

  useEffect(() => {
    fetchChatAttachments(chat);
  }, []);

  return (
    <Tabs defaultValue="media" className="w-full text-center">
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="media">
          Media
        </TabsTrigger>
        <TabsTrigger className="w-full" value="files">
          Files
        </TabsTrigger>
        <TabsTrigger className="w-full" value="voice">
          Voice
        </TabsTrigger>
        <TabsTrigger className="w-full" value="members">
          Members
        </TabsTrigger>
      </TabsList>
      <TabsContent value="media" className="">
        <MsgAttachment chat={chat} type="MEDIA" openViewer={openViewer} />
      </TabsContent>
      <TabsContent value="files">
        <MsgAttachment chat={chat} type="FILE" />
      </TabsContent>
      <TabsContent value="voice">
        <MsgAttachment chat={chat} type="AUDIO" />
      </TabsContent>
      <TabsContent value="members">
        <ChatMembers chat={chat} canEdit={canEdit} />
      </TabsContent>
    </Tabs>
  );
};

export default ChatTabs;

const MsgAttachment = ({
  chat,
  type,
  openViewer,
}: {
  chat: Chat;
  type: ChatAttachmentMsgsFilterType;
  openViewer?: (params: AttachmentViewerParams) => void;
}) => {
  const { msgs } = useFilteredChatAttachmentMsgs({ chatUid: chat.uid, type });

  if (msgs.length === 0)
    return (
      <p className="text-slate-500 p-2">No {type.toLowerCase()} shared yet.</p>
    );

  return (
    <div
      className={cn(
        "max-h-[calc(100vh-300px)] overflow-x-hidden overflow-y-auto no-scrollbar",
        type === "MEDIA" ? "grid grid-cols-3" : "flex flex-col"
      )}
    >
      {msgs.map((msg, idx) => {
        if (!msg.attachment) return null;

        if (type == "MEDIA") {
          return (
            <BareButton
              key={idx}
              onClick={() => {
                openViewer && openViewer(msg);
              }}
            >
              <AttachementContent
                className="rounded-none aspect-square"
                caption={msg.text}
                attachment={msg.attachment}
                isPreview
              />
            </BareButton>
          );
        }

        const msgTime = format(msg.createdAt, "PPPPp");

        return (
          <div
            key={idx}
            className={cn("border-b border-b-slate-100 flex flex-col py-6")}
          >
            <AttachementContent
              caption={msg.text}
              attachment={msg.attachment}
            />
            <p className="text-xs font-normal text-slate-500 text-left mt-3">
              Sent {msgTime}
            </p>
          </div>
        );
      })}
    </div>
  );
};
