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
      className={cn("text-xs font-normal text-gray-500 select-none", className)}
    >
      {text}
    </p>
  );
};

export default EmptyAttachment;
