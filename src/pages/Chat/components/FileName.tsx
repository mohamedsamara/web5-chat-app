import { cn } from "lib/utils";

const FileName = ({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) => {
  return <span className={cn("text-slate-500", className)}>{fileName}</span>;
};

export default FileName;
