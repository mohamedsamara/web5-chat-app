import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];

export const getRandomColors = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

const cache: { [key in string]: string } = {};
export const getMemoizedRandomColors = (s: string) => {
  const color = getRandomColors();

  if (s in cache) {
    return cache[s];
  } else {
    const result = color;
    cache[s] = result;
    return result;
  }
};

export const fileToBase64 = async (file: File) => {
  const binaryImage = await file.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(binaryImage).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return base64;
};

export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const getAvatarUrl = (base64: string) =>
  `data:image/png;base64,${base64}`;

export const formatFileSize = (bytes: number, precision = 0) => {
  const units = ["B", "kB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const mantissa = bytes / 1024 ** exponent;
  const formattedMantissa =
    precision === 0
      ? Math.round(mantissa).toString()
      : mantissa.toPrecision(precision);
  return `${formattedMantissa} ${units[exponent]}`;
};

export const divider = (num: number, divisor: number) => [
  Math.floor(num / divisor),
  num % divisor,
];

export const formatDuration = (duration?: number) => {
  if (!duration || duration < 0) return "00:00";

  const [hours, hoursLeftover] = divider(duration, 3600);
  const [minutes, seconds] = divider(hoursLeftover, 60);
  const roundedSeconds = Math.ceil(seconds);

  const prependHrsZero = hours.toString().length === 1 ? "0" : "";
  const prependMinZero = minutes.toString().length === 1 ? "0" : "";
  const prependSecZero = roundedSeconds.toString().length === 1 ? "0" : "";
  const minSec = `${prependMinZero}${minutes}:${prependSecZero}${roundedSeconds}`;

  return hours ? `${prependHrsZero}${hours}:` + minSec : minSec;
};

export const generateAudioRecordingName = (mimeType: string) => {
  return `audio_recording_${new Date().toISOString()}.${getExtensionFromMimeType(
    mimeType
  )}`;
};

export const getExtensionFromMimeType = (mimeType: string) => {
  const match = mimeType.match(/\/([^/;]+)/);
  return match && match[1];
};

export const isSafari = () => {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent || "");
};

export const getAudioMimeType = (mimeType: string) => {
  return mimeType.substring(0, mimeType.indexOf(";"));
};

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
