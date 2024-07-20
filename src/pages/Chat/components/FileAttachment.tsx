import { useInView } from "react-intersection-observer";

import { Attachment } from "lib/types";
import { useAttachment } from "lib/hooks";
import { cn } from "lib/utils";

import { Link } from "react-router-dom";
import { CloudDownload } from "lucide-react";
import FileSizeIndicator from "./FileSizeIndicator";
import MimeIcon from "./MimeIcon";

type Props = {
  className?: string;
  isPreview: boolean;
  attachment: Attachment;
  caption: string;
};

const FileAttachment = ({ className, isPreview, attachment }: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "0px",
    triggerOnce: true,
  });
  const { url } = useAttachment({
    visible: inView,
    attachment,
  });
  const fileName = attachment.name || "File";

  if (isPreview)
    return (
      <div
        ref={ref}
        className="flex items-center gap-1 text-gray-700 text-sm select-none w-28"
      >
        <MimeIcon mimeType={attachment.mimeType} />
        <p className="truncate">{fileName}</p>
      </div>
    );

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-gray-700 text-sm select-none",
        className
      )}
    >
      <MimeIcon mimeType={attachment.mimeType} />
      <div className="flex flex-col">
        <span>{fileName}</span>
        <div className="flex items-center gap-1">
          <FileSizeIndicator size={attachment.size} />
          <Link
            className="flex justify-center items-center relative rounded-full aspect-1 w-6 h-6"
            to={url}
            target="_blank"
            download={fileName}
          >
            <CloudDownload className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FileAttachment;
