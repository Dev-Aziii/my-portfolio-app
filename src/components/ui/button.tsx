import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-mono uppercase tracking-wider font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground dark:focus-visible:ring-cyan-400",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-400 dark:hover:bg-cyan-500/30 dark:hover:text-white dark:shadow-[0_0_12px_rgba(0,240,255,0.25)] shadow-none cursor-pointer",
        destructive:
          "bg-destructive text-white border border-destructive hover:bg-destructive/90 shadow-none cursor-pointer",
        outline:
          "bg-card text-foreground border border-border hover:border-foreground dark:bg-[#0a1526] dark:border-cyan-900/60 dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:text-cyan-200 dark:hover:bg-cyan-950/30 transition-colors shadow-none cursor-pointer",
        secondary:
          "bg-card/80 text-foreground border border-border hover:border-foreground hover:bg-card dark:bg-[#091526] dark:border-cyan-500/30 dark:text-cyan-200 dark:hover:border-cyan-400 dark:hover:bg-cyan-950/40 transition-colors cursor-pointer",
        ghost:
          "hover:bg-card hover:text-foreground text-muted-foreground dark:text-cyan-200/80 dark:hover:text-cyan-300 dark:hover:bg-cyan-950/30 transition-colors cursor-pointer",
        link: "text-muted-foreground hover:text-foreground dark:text-cyan-400/80 dark:hover:text-cyan-300 underline-offset-4 hover:underline transition-colors",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 gap-1.5 px-2.5 text-[11px]",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
