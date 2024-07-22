import { formatDuration } from "lib/utils";

type Props = {
  duration: number;
};
const RecordingTimer = ({ duration }: Props) => {
  const d = formatDuration(duration);

  return <span>{d}</span>;
};

export default RecordingTimer;
