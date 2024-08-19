import { cn, segregateMsgText } from "lib/utils";
import MsgLink from "./MsgLink";
import MsgDid from "./MsgDid";

type Props = {
  text: string;
  className?: string;
  isShortPreview?: boolean;
};

const MsgText = ({ text, className, isShortPreview = false }: Props) => {
  const { content, link, isValidLink } = segregateMsgText(text);
  const showLink = isValidLink && !isShortPreview;

  return (
    <>
      {showLink && <MsgLink link={link} />}
      <div
        className={cn(
          "text-sm font-normal select-none break-words text-slate-700",
          className
        )}
      >
        {content.map((m, idx) =>
          m.isLink ? (
            <a
              key={idx}
              href={m.text}
              rel="noreferrer noopener"
              target="_blank"
              className="text-blue-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50"
            >
              {m.text + " "}
            </a>
          ) : m.isDid ? (
            <MsgDid key={idx} did={m.text} isShortPreview={isShortPreview} />
          ) : (
            <span key={idx}>{m.text + " "}</span>
          )
        )}
      </div>
    </>
  );
};

export default MsgText;
