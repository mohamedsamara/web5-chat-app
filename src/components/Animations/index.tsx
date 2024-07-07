import { PropsWithChildren } from "react";

import { cn } from "lib/utils";

type Props = PropsWithChildren & {
  className?: string;
  visible: boolean;
};

const Fade = ({ className, visible, children }: Props) => {
  return (
    <div className={cn(className, visible ? "fade-in" : "fade-out")}>
      {children}
    </div>
  );
};

export default Fade;
