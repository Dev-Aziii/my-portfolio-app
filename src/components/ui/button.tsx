import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary hover:bg-primary/85 shadow-none cursor-pointer",
        destructive:
          "bg-destructive text-white border border-destructive hover:bg-destructive/90 shadow-none cursor-pointer",
        outline:
          "bg-card text-foreground border border-border hover:border-foreground hover:bg-secondary transition-colors shadow-none cursor-pointer",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:border-foreground hover:bg-accent transition-colors cursor-pointer",
        ghost:
          "hover:bg-secondary hover:text-foreground text-muted-foreground transition-colors cursor-pointer",
        link: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors",
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
