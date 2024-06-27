import { cn } from "lib/utils";
import UserAvatar from "components/UserAvatar";

type Props = {
  noStyles: boolean;
  end: boolean;
  showAvatar: boolean;
  showName: boolean;
  avatar: string;
  name: string;
  text: string;
  time: string;
};

const ChatBubble = ({
  noStyles = false,
  end = false,
  showAvatar = false,
  showName = false,
  avatar,
  name,
  text,
  time,
}: Props) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5",
        end ? "justify-end pr-2" : "pl-2"
      )}
    >
      <div className={cn(end ? "order-2" : "order-1")}>
        <div className="w-8 h-8">
          {showAvatar && <UserAvatar src={avatar} alias={name} />}
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 dark:bg-gray-700",
          end
            ? "order-1 rounded-s-3xl rounded-ee-3xl"
            : "order-2 rounded-e-3xl rounded-es-3xl",
          noStyles ? "rounded-3xl" : ""
        )}
      >
        {showName && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {name}
            </span>
          </div>
        )}
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {text}
        </p>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {time}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
