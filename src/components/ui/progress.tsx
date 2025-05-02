
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, style, ...props }, ref) => {
  // Set default CSS variables if not provided
  const progressStyle = {
    ...style,
    "--progress-background": style?.["--progress-background"] || "hsl(var(--secondary))",
    "--progress-foreground": style?.["--progress-foreground"] || "hsl(var(--primary))"
  } as React.CSSProperties;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      style={{
        backgroundColor: "var(--progress-background)"
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full flex-1 rounded-full transition-all"
        style={{ 
          width: `${value || 0}%`,
          backgroundColor: "var(--progress-foreground)"
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
