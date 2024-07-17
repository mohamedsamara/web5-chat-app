import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const loaderVariants = cva("animate-spin", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type Props = VariantProps<typeof loaderVariants> & {
  className?: string;
};

const Loader = ({ variant, size, className }: Props) => {
  return (
    <Loader2 className={cn(loaderVariants({ variant, size, className }))} />
  );
};

export default Loader;
