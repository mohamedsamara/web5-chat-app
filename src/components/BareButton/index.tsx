import * as React from "react";

import { cn } from "lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const BareButton = ({ className, children, ...rest }: Props) => {
  return (
    <button
      className={cn(
        "relative group cursor-pointer",
        "block w-full h-full bg-none shadow-none",
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default BareButton;
