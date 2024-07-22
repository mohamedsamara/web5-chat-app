import { Attachment } from "lib/types";
import PhotoAttachment from "./PhotoAttachment";
import VideoAttachment from "./VideoAttachment";
import FileAttachment from "./FileAttachment";
import AudioAttachment from "./AudioAttachment";

type Props = {
  className?: string;
  isPreview?: boolean;
  autoPlay?: boolean;
  attachment: Attachment;
  caption: string;
};

const AttachementContent = ({
  className,
  isPreview = false,
  autoPlay = false,
  caption,
  attachment,
}: Props) => {
  switch (attachment.type) {
    case "IMAGE":
      return <PhotoAttachment className={className} attachment={attachment} />;
    case "VIDEO":
      return (
        <VideoAttachment
          className={className}
          attachment={attachment}
          isPreview={isPreview}
          autoPlay={autoPlay}
        />
      );
    case "FILE":
      return (
        <FileAttachment
          className={className}
          isPreview={isPreview}
          caption={caption}
          attachment={attachment}
        />
      );
    case "AUDIO":
      return (
        <AudioAttachment
          className={className}
          isPreview={isPreview}
          attachment={attachment}
        />
      );
    default:
      return <></>;
  }
};

export default AttachementContent;
