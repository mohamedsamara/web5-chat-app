import { Attachment } from "lib/types";
import MsgPhoto from "./MsgPhoto";
import MsgVideo from "./MsgVideo";

type Props = {
  className?: string;
  isPreview?: boolean;
  autoPlay?: boolean;
  attachment: Attachment;
};

const AttachementContent = ({
  className,
  isPreview = false,
  autoPlay = false,
  attachment,
}: Props) => {
  switch (attachment.type) {
    case "IMAGE":
      return <MsgPhoto className={className} attachment={attachment} />;
    case "VIDEO":
      return (
        <MsgVideo
          className={className}
          attachment={attachment}
          isPreview={isPreview}
          autoPlay={autoPlay}
        />
      );
    default:
      return <></>;
  }
};

export default AttachementContent;
