"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden [scrollbar-gutter:stable]", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit] overflow-y-auto min-h-0 overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      orientation="vertical"
      className="bg-border/40 hover:bg-border/60 data-[state=hidden]:invisible z-[1] flex touch-none select-none transition-colors h-full w-2 border-l"
    >
      <ScrollAreaPrimitive.Thumb className="relative bg-border-foreground/40 rounded-full before:bg-border-foreground/40 before:absolute before:left-1/2 before:top-1/2 before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Scrollbar
      orientation="horizontal"
      className="bg-border/40 hover:bg-border/60 data-[state=hidden]:invisible z-[1] flex touch-none select-none transition-colors h-2 w-full border-t"
    >
      <ScrollAreaPrimitive.Thumb className="relative bg-border-foreground/40 rounded-full before:bg-border-foreground/40 before:absolute before:left-1/2 before:top-1/2 before:h-full before:w-full before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea }
