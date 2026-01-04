import React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { IngredientTopTab } from "../model/use-ingredient-top-tabs";

interface Props {
  className?: string;
  value: IngredientTopTab;
  onChange: (v: IngredientTopTab) => void;
}

export const IngredientTopTabs: React.FC<Props> = ({
  className,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, "flex flex-wrap gap-2")}>
      <Button
        type="button"
        variant={value === "top-10" ? "secondary" : "ghost"}
        onClick={() => onChange("top-10")}
      >
        Top 10
      </Button>

      <Button
        type="button"
        variant={value === "top-20" ? "secondary" : "ghost"}
        onClick={() => onChange("top-20")}
      >
        Top 20
      </Button>
    </div>
  );
};
