import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        brandGradient:
          "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 via-violet-600 to-brand-600 bg-[length:200%_auto] bg-left px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-6px_rgba(79,70,229,0.5)] transition-all duration-300 hover:bg-right hover:shadow-[0_12px_32px_-6px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200",
        gold:
          "inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-base font-bold text-brand-950 shadow-glow-gold-idle transition-all duration-300 hover:shadow-glow-gold hover:bg-gold-400 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-200",
        destructive:
          "inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-200 transition-colors duration-150 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500",
        outline:
          "inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-600 bg-transparent px-8 py-4 text-base font-semibold text-brand-600 transition-colors duration-200 hover:bg-brand-50 active:bg-brand-100",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
