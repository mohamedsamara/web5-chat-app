import { CloudDownload } from "lucide-react";

import { AttachmentMimeType } from "lib/types";
import { getTypeOfAttachment } from "lib/utils";
import { Link } from "components/Links";
import FileSizeIndicator from "./FileSizeIndicator";
import MimeIcon from "./MimeIcon";

const AttachmentUploaderPreview = ({ attachment }: { attachment: File }) => {
  const fileName = attachment.name;
  const type = getTypeOfAttachment(attachment.type);
  const url = URL.createObjectURL(attachment);

  switch (type) {
    case "IMAGE":
      return <img src={url} />;
    case "VIDEO":
      return (
        <video>
          <source src={url} />
        </video>
      );
    case "FILE":
      return (
        <div className="flex items-center justify-center gap-2 border border-gray-200 py-2 px-4 rounded-md text-slate-700 text-sm max-w-[225px] min-w-[145px]">
          <div className="base-12">
            <MimeIcon mimeType={attachment.type as AttachmentMimeType} />
          </div>
          <div className="flex flex-col flex-1  min-w-0">
            <span className="truncate">{fileName}</span>
            <div className="flex items-center gap-1">
              <FileSizeIndicator size={attachment.size} />
              <Link
                className="flex justify-center items-center relative rounded-full aspect-1 w-6 h-6 "
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
    default:
      return <></>;
  }
};

export default AttachmentUploaderPreview;
