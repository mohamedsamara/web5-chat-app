import { PropsWithChildren } from "react";

import { cn } from "lib/utils";
import UserAvatar from "components/UserAvatar";

type Props = PropsWithChildren & {
  className?: string;
  bubbleStyles?: string;
  noStyles: boolean;
  end: boolean;
  showAvatar: boolean;
  showName: boolean;
  avatar: string;
  name: string;
  time: string;
  actions: JSX.Element;
};

const ChatBubble = ({
  className,
  bubbleStyles,
  noStyles = false,
  end = false,
  showAvatar = false,
  showName = false,
  avatar,
  name,
  time,
  children,
  actions,
}: Props) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 group",
        end ? "justify-end pr-2" : "pl-2",
        className
      )}
    >
      <div
        className={cn(
          "self-start fade-out group-hover:fade-in",
          end ? "order-1 pr-2" : "order-3 pl-2"
        )}
      >
        {actions}
      </div>

      <div className={cn(end ? "order-3" : "order-1")}>
        <div className="w-8 h-8">
          {showAvatar && <UserAvatar src={avatar} alias={name} />}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 w-full max-w-[320px]",
          end ? "order-2" : "order-2"
        )}
      >
        <div
          className={cn(
            "border overflow-hidden",
            end
              ? "rounded-s-3xl rounded-ee-3xl bg-muted border-slate-200"
              : "rounded-e-3xl rounded-es-3xl bg-white text-black border-blue-50",
            noStyles ? "rounded-3xl" : "",
            bubbleStyles
          )}
        >
          {children}
        </div>

        <div className="flex items-center gap-2 pt-1 pl-2">
          {showName && (
            <span className="text-sm text-slate-500 select-none">{name}</span>
          )}
          <span className="text-xs font-normal text-slate-500 select-none">
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
