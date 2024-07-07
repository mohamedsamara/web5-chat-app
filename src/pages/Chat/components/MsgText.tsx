import { cn } from "lib/utils";

type Props = {
  text: string;
  className?: string;
};

const MsgText = ({ text, className }: Props) => {
  return (
    <p className={cn("text-sm font-normal select-none", className)}>{text}</p>
  );
};

export default MsgText;
