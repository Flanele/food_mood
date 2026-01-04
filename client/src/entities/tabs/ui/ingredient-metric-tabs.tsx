import React from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { IngredientMetric } from "@/shared";

interface Props {
  className?: string;
  value: IngredientMetric;
  onChange: (metric: IngredientMetric) => void;
}

export const IngredientMetricTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-2")}>
      <Button
        type="button"
        variant={value === "count" ? "secondary" : "ghost"}
        onClick={() => onChange("count")}
      >
        count
      </Button>

      <Button
        type="button"
        variant={value === "totalGrams" ? "secondary" : "ghost"}
        onClick={() => onChange("totalGrams")}
      >
        grams
      </Button>

      <Button
        type="button"
        variant={value === "totalKcal" ? "secondary" : "ghost"}
        onClick={() => onChange("totalKcal")}
      >
        kcal
      </Button>
    </div>
  );
};
