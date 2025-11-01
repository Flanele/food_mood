"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";
import React from "react";

interface Props {
  text: string;
}

export const HelpTooltip: React.FC<Props> = ({ text }) => {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            className="flex items-center justify-center w-6 h-6 rounded-full text-primary hover:bg-secondary/80 transition-colors"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            align="center"
            className="max-w-[240px] bg-secondary text-foreground text-sm p-3 rounded-md shadow-md border border-border z-50 whitespace-pre-wrap"
          >
            {text}
            <Tooltip.Arrow className="fill-secondary" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
