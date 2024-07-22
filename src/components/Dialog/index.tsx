import { PropsWithChildren } from "react";

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
              <CloseButton variant="ghost" onClick={onClose} />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
      </DialogContent>
    </RadixDialog>
  );
};

export default Dialog;
