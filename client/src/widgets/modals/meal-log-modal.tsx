import { MealLogForm } from "@/features/forms";
import { MakeMealLogForm } from "@/features/meal-log";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface Props {
  className?: string;
  id: number;
  contentWidth?: number;
  onClose: () => void;
}

export const MealLogModal: React.FC<Props> = ({
  className,
  id,
  onClose,
  contentWidth = 740,
}) => {
  return (
    <div className={cn("fixed inset-0 z-50", className)}>
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="w-full bg-background rounded-sm shadow-xl"
          style={{ maxWidth: contentWidth }}
        >
          {/* header */}
          <div className="flex items-center justify-between border-b border-secondary/60 px-6 py-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Meal log</h2>
              <p className="text-sm text-muted-foreground">
                Add servings, time and optional scores
              </p>
            </div>

            <button
              type="button"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground cursor-pointer"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* content */}
            <MakeMealLogForm recipeId={id} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};
