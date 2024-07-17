import { PropsWithChildren } from "react";
import { X } from "lucide-react";

import {
  Dialog as RadixDialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Button } from "components/ui/button";

type Props = PropsWithChildren & {
  title: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onClose: () => void;
  trigger?: JSX.Element;
};

const Dialog = ({
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
      <DialogContent className="sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{title}</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={onClose}
              >
                <span className="sr-only">Close dialog</span>
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
      </DialogContent>
    </RadixDialog>
  );
};

export default Dialog;
