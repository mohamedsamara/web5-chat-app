import { formatFileSize } from "@/lib/utils";

const FileSizeIndicator = ({ size }: { size: number }) => {
  if (!(size && Number.isFinite(Number(size)))) return null;
  const formattedSize = formatFileSize(size);

  return (
    <div className="flex items-center gap-1">
      <span>{formattedSize}</span>
      <span>-</span>
    </div>
  );
};

export default FileSizeIndicator;
