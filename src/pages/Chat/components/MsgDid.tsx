import { QrCode } from "lucide-react";

import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
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
      <div className="flex items-center max-w-full gap-1">
        <QrCode className="w-4 h-4 text-indigo-500" />
        <DidText did={did} />
      </div>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="none"
          className="flex h-auto max-w-full p-0 text-sm font-normal"
        >
          <div className="flex items-center max-w-full gap-1">
            <QrCode className="w-6 h-6 text-indigo-500" />
            <DidText did={did} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <DidDetails className="p-2" did={did} />
      </PopoverContent>
    </Popover>
  );
};

export default MsgDid;

const DidText = ({ did }: { did: string }) => (
  <span className="truncate">{did + " "} </span>
);
