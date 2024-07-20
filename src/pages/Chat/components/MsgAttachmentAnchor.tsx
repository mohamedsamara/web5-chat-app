import { PropsWithChildren } from "react";
import { Video } from "lucide-react";

import { Attachment } from "lib/types";
import { cn } from "lib/utils";
import {
  useAttachmentViewer,
  useIsAttachmentViewable,
  useIsMsgSwiping,
} from "lib/hooks";
import BareButton from "components/BareButton";

type Props = PropsWithChildren & {
  attachment: Attachment;
  caption: string;
};

const MsgAttachmentAnchor = ({ children, attachment, caption }: Props) => {
  const { isMsgSwiping } = useIsMsgSwiping();
  const { openViewer } = useAttachmentViewer();
  const { isViewable } = useIsAttachmentViewable(attachment.type);
  const isVideo = attachment.type === "VIDEO";

  if (!isViewable)
    return (
      <div className={cn("px-4", caption ? "pt-3" : "py-2")}>{children}</div>
    );

  return (
    <div className={cn("px-2 pt-2", caption ? "" : "pb-2")}>
      <BareButton
        className="rounded-2xl overflow-hidden"
        onClick={() => {
          if (isMsgSwiping) return;
          openViewer({ caption, attachment });
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
