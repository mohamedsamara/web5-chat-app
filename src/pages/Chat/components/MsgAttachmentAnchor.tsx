import { PropsWithChildren } from "react";
import { Video } from "lucide-react";

import { Attachment, ChatMsg } from "lib/types";
import { cn } from "lib/utils";
import { useAttachmentViewer, useIsAttachmentViewable } from "lib/hooks";
import { BareButton } from "components/Buttons";

type Props = PropsWithChildren & {
  attachment: Attachment;
  msg: ChatMsg;
};

const MsgAttachmentAnchor = ({ children, attachment, msg }: Props) => {
  const { openViewer } = useAttachmentViewer();
  const { isViewable } = useIsAttachmentViewable(attachment.type);
  const isVideo = attachment.type === "VIDEO";

  if (!isViewable)
    return (
      <div className={cn("px-[0.6rem]", msg.text ? "pt-3" : "py-2")}>
        {children}
      </div>
    );

  return (
    <div className={cn("px-2 pt-2", msg.text ? "" : "pb-2")}>
      <BareButton
        className="rounded-2xl overflow-hidden"
        onClick={() => {
          openViewer(msg);
        }}
      >
        {isViewable && (
          <div className="absolute inset-0 fade-out group-hover:fade-in bg-black/20 z-[1]">
            {isVideo && (
              <div className="absolute bottom-4 right-0 left-4">
                <Video className="h-4 w-4 fill-white text-white" />
              </div>
            )}
          </div>
        )}

        {children}
      </BareButton>
    </div>
  );
};

export default MsgAttachmentAnchor;
