import QRCode from "react-qr-code";

import { cn } from "lib/utils";
import { CopyButton } from "components/Buttons";

const DidDetails = ({
  did,
  className,
}: {
  did: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2 w-48", className)}>
      <QRCode
        value={did}
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 256 256`}
      />
      <div className="flex items-center justify-center gap-4">
        <div className="truncate flex-1 text-slate-500">
          <span>{did}</span>
        </div>
        <CopyButton value={did || ""} />
      </div>
    </div>
  );
};

export default DidDetails;
