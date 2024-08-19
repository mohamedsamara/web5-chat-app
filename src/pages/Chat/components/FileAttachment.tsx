import { useInView } from "react-intersection-observer";
import { Download } from "lucide-react";

import { Attachment } from "lib/types";
import { useAttachment } from "lib/hooks";
import { cn } from "lib/utils";
import { Link } from "components/Links";
import FileSizeIndicator from "./FileSizeIndicator";
import MimeIcon from "./MimeIcon";
import FileName from "./FileName";

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
        className="flex items-center gap-1 text-sm select-none max-w-28"
      >
        <MimeIcon mimeType={attachment.mimeType} />
        <FileName fileName={fileName} className="truncate" />
      </div>
    );

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 text-sm select-none", className)}
    >
      <MimeIcon mimeType={attachment.mimeType} />
      <div className="flex flex-col">
        <FileName fileName={fileName} />
        <div className="flex items-center gap-1">
          <FileSizeIndicator size={attachment.size} />
          <Link
            className="flex justify-center items-center relative rounded-full aspect-1 w-6 h-6"
            to={url}
            target="_blank"
            download={fileName}
          >
            <Download className="w-4 h-4 text-slate-600" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FileAttachment;
