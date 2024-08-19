import { formatDuration } from "lib/utils";

type Props = {
  duration: number;
};
const RecordingTimer = ({ duration }: Props) => {
  const d = formatDuration(duration);

  return <span className="text-slate-600 text-sm">{d}</span>;
};

export default RecordingTimer;
