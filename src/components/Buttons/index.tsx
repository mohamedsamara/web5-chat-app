import * as React from "react";
import { Copy, CopyCheck, X } from "lucide-react";

import { useCopyToClipboard } from "lib/hooks";
import { Button, ButtonProps } from "../ui/button";

type CopyButtonProps = {
  value: string;
};

export const CopyButton = (props: CopyButtonProps) => {
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

export const CloseButton = ({
  iconStyles,
  ...rest
}: ButtonProps & { iconStyles?: string }) => {
  return (
    <Button
      variant="none"
      size="icon"
      className="rounded-full h-6 w-6"
      {...rest}
    >
      <X className={cn("h-4 w-4", iconStyles)} />
    </Button>
  );
};

import { cn } from "lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BareButton = ({ className, children, ...rest }: Props) => {
  return (
    <button
      className={cn(
        "relative group cursor-pointer",
        "block w-full h-full bg-none shadow-none",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
