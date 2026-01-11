import React from "react";
import { Button } from "@/shared/ui";
import { ObjectiveTab } from "../model/use-recommendation-objective-tabs";
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
  value: ObjectiveTab;
  onChange: (tab: ObjectiveTab) => void;
}

export const RecommendationObjectiveTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-5")}>
      <Button
        type="button"
        variant={value === "balanced" ? "secondary" : "ghost"}
        onClick={() => onChange("balanced")}
        className="text-lg"
      >
        Balanced
      </Button>

      <Button
        type="button"
        variant={value === "mood" ? "secondary" : "ghost"}
        onClick={() => onChange("mood")}
        className="text-lg"
      >
        Mood
      </Button>

      <Button
        type="button"
        variant={value === "energy" ? "secondary" : "ghost"}
        onClick={() => onChange("energy")}
        className="text-lg"
      >
        Energy
      </Button>

      <Button
        type="button"
        variant={value === "sleep" ? "secondary" : "ghost"}
        onClick={() => onChange("sleep")}
        className="text-lg"
      >
        Sleep
      </Button>
    </div>
  );
};
