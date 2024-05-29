import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function MyTooltip({ trigger, content, delayDuration = 300, side = "right" }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration} >
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent side={side} className="text-foreground bg-secondary backdrop-blur-sm border">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
