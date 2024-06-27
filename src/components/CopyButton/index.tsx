import { Copy, CopyCheck } from "lucide-react";

import { useCopyToClipboard } from "lib/hooks";
import { Button } from "../ui/button";

type Props = {
  value: string;
};

const CopyButton = (props: Props) => {
  const { value } = props;
  const [copyUrlStatus, copy] = useCopyToClipboard(value);
  const isCopied = copyUrlStatus === "copied";

  return (
    <Button
      size="icon"
      className="relative rounded-full aspect-1 p-0 w-8 h-8"
      onClick={copy}
    >
      {isCopied ? (
        <CopyCheck className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );
};

export default CopyButton;
