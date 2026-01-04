import React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { IngredientPeriodTab } from "../model/use-ingredient-period-tabs";

interface Props {
  className?: string;
  value: IngredientPeriodTab;
  onChange: (v: IngredientPeriodTab) => void;
}

export const IngredientPeriodTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-2")}>
      <Button
        type="button"
        variant={value === "all-time" ? "secondary" : "ghost"}
        onClick={() => onChange("all-time")}
      >
        All time
      </Button>

      <Button
        type="button"
        variant={value === "custom-period" ? "secondary" : "ghost"}
        onClick={() => onChange("custom-period")}
      >
        Custom period
      </Button>
    </div>
  );
};
