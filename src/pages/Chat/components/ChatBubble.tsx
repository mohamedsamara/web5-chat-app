import { PropsWithChildren } from "react";

import { cn } from "lib/utils";
import UserAvatar from "components/UserAvatar";
import ForwardIcon from "assets/forward.svg";
import Fade from "components/Animations";

type Props = PropsWithChildren & {
  className?: string;
  bubbleStyles?: string;
  noStyles: boolean;
  showForward: boolean;
  end: boolean;
  showAvatar: boolean;
  showName: boolean;
  avatar: string;
  name: string;
  time: string;
};

const ChatBubble = ({
  showForward,
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
}: Props) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5",
        end ? "justify-end pr-2" : "pl-2",
        className
      )}
    >
      <Fade
        className={cn("self-center", end ? "order-1" : "order-3")}
        visible={showForward}
      >
        <img
          draggable={false}
          src={ForwardIcon}
          alt="Forward Icon"
          className="w-6 h-6 select-none"
        />
      </Fade>

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
        {showName && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-neutral-800 select-none">{name}</span>
          </div>
        )}
        <div
          className={cn(
            "border overflow-hidden",
            end
              ? "rounded-s-3xl rounded-ee-3xl bg-muted border-gray-200"
              : "rounded-e-3xl rounded-es-3xl bg-white text-black border-blue-50",
            noStyles ? "rounded-3xl" : "",
            bubbleStyles
          )}
        >
          {children}
        </div>
        <span className="text-xs font-normal text-gray-500 select-none">
          {time}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
