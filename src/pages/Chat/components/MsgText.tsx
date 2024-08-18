import { cn, segregateMsgText } from "lib/utils";
import MsgLink from "./MsgLink";

type Props = {
  text: string;
  className?: string;
  linkHidden?: boolean;
};

const MsgText = ({ text, className, linkHidden = false }: Props) => {
  const { content, link, isValidLink } = segregateMsgText(text);
  const showLink = isValidLink && !linkHidden;

  return (
    <>
      {showLink && <MsgLink link={link} />}

      <div className={cn("text-sm font-normal select-none", className)}>
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
          ) : (
            m.text + " "
          )
        )}
      </div>
    </>
  );
};

export default MsgText;
