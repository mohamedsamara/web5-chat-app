import { cn } from "lib/utils";

const EmptyAttachment = ({
  text = "Attachment not found",
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-xs font-normal text-slate-500 select-none",
        className
      )}
    >
      {text}
    </p>
  );
};

export default EmptyAttachment;
