import { PropsWithChildren } from "react";

import { cn } from "lib/utils";
import {
  Dialog as RadixDialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { CloseButton } from "../Buttons";

type Props = PropsWithChildren & {
  className?: string;
  title?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onClose: () => void;
  trigger?: JSX.Element;
};

const Dialog = ({
  className,
  title,
  trigger,
  open,
  onOpenChange,
  onClose,
  children,
}: Props) => {
  return (
    <RadixDialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("flex flex-col sm:max-w-[425px]", className)}
        hideClose
      >
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{title}</DialogTitle>
            <DialogClose asChild>
              <CloseButton variant="ghost" onClick={onClose} />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex flex-col flex-1 gap-4 py-2 h-full">{children}</div>
      </DialogContent>
    </RadixDialog>
  );
};

export default Dialog;
