import { ChipsInput } from "@/features/filters";
import { RecipeFilters, RecipeListQuery } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { RangeSlider } from "@/shared/ui/range-slider";
import React from "react";

interface Props {
  className?: string;
  value: RecipeListQuery;
  onChange: (next: RecipeListQuery) => void;
}

export const FiltersBar: React.FC<Props> = ({ className, value, onChange }) => {
  const q = value;

  const setFilters = (patch: Partial<RecipeFilters>) =>
    onChange({
      ...q,
      page: 1,
      filters: { ...(q.filters ?? {}), ...patch },
    });

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col mb-5">
        <span className="text-xl mb-2">kcal:</span>
        <RangeSlider
          min={0}
          max={500}
          step={10}
          value={[q.filters?.minKcal ?? 0, q.filters?.maxKcal ?? 500]}
          onValueChange={([min, max]) =>
            setFilters({ minKcal: min, maxKcal: max })
          }
        />

        <span className="text-xl mb-2">protein:</span>
        <RangeSlider
          min={0}
          max={50}
          step={1}
          value={[q.filters?.minProt ?? 0, q.filters?.maxProt ?? 50]}
          onValueChange={([min, max]) =>
            setFilters({ minProt: min, maxProt: max })
          }
        />

        <span className="text-xl mb-2">sugar:</span>
        <RangeSlider
          min={0}
          max={50}
          step={1}
          value={[q.filters?.minSugar ?? 0, q.filters?.maxSugar ?? 50]}
          onValueChange={([min, max]) =>
            setFilters({ minSugar: min, maxSugar: max })
          }
        />
      </div>

      <div className="flex flex-col gap-4">
        <ChipsInput
          label="include ingredients:"
          value={q.filters?.includeIngredients ?? []}
          onChange={(arr) => setFilters({ includeIngredients: arr })}
          placeholder="type and press Enter…"
        />
        <ChipsInput
          label="exclude ingredients:"
          value={q.filters?.excludeIngredients ?? []}
          onChange={(arr) => setFilters({ excludeIngredients: arr })}
          placeholder="for example, broccoli…"
        />
      </div>
    </div>
  );
};
