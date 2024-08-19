import { formatFileSize } from "@/lib/utils";

const FileSizeIndicator = ({ size }: { size: number }) => {
  if (!(size && Number.isFinite(Number(size)))) return null;
  const formattedSize = formatFileSize(size);

  return (
    <div className="flex items-center gap-1">
      <span className="text-slate-500">{formattedSize}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="self-center"
        width="3"
        height="4"
        viewBox="0 0 3 4"
        fill="none"
      >
        <circle cx="1.5" cy="2" r="1.5" className="fill-slate-600" />
      </svg>
    </div>
  );
};

export default FileSizeIndicator;
