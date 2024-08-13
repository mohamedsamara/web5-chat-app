import { cn } from "@/lib/utils";
import { Link as RLink, LinkProps } from "react-router-dom";

export const Link = ({ children, className, ...rest }: LinkProps) => {
  return (
    <RLink
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {children}
    </RLink>
  );
};
