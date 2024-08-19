import { cn } from "lib/utils";

const ChatName = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  return (
    <h4 className={cn("text-slate-900 text-sm leading-4", className)}>
      {name || "Dummy"}
    </h4>
  );
};

export default ChatName;
