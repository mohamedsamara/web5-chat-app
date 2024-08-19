import { AttachmentMimeType } from "lib/types";
import { File, FileJson } from "lucide-react";

const MimeIcon = ({ mimeType }: { mimeType: AttachmentMimeType }) => {
  switch (mimeType) {
    case "application/json":
      return <FileJson className="w-6 h-6 text-slate-600" />;
    default:
      return <File className="w-6 h-6 text-slate-600" />;
  }
};
export default MimeIcon;
