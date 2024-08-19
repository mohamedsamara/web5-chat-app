import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { QrCode } from "lucide-react";
import { DidDetails } from "pages/ChatSettings/components";

const MsgDid = ({
  did,
  isShortPreview,
}: {
  did: string;
  isShortPreview: boolean;
}) => {
  if (isShortPreview)
    return (
      <div className="flex items-center gap-1 max-w-full">
        <QrCode className="w-4 h-4 text-indigo-500" />
        <span className="truncate text-gray-600">{did + " "} </span>
      </div>
    );
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="none"
          className="text-sm font-normal max-w-full p-0 h-auto flex"
        >
          <div className="flex items-center gap-1 max-w-full">
            <QrCode className="w-6 h-6 text-indigo-500" />
            <span className="truncate text-gray-600">{did + " "} </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount>
        <DidDetails className="p-2" did={did} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MsgDid;
