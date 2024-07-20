import { AttachmentMimeType } from "lib/types";
import { File, FileJson } from "lucide-react";

const MimeIcon = ({ mimeType }: { mimeType: AttachmentMimeType }) => {
  switch (mimeType) {
    case "application/json":
      return <FileJson className="w-8 h-8" />;
    default:
      return <File className="w-8 h-8" />;
  }
};
export default MimeIcon;
