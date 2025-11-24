import { ChipsInput } from "@/features/filters";
import { useRecipeListFilters } from "@/features/recipes/recipe-list";
import { RecipeFilters, RecipeListQuery } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { RangeSlider } from "@/shared/ui/range-slider";
import React from "react";

interface Props {
  className?: string;
}

export const FiltersBar: React.FC<Props> = ({ className }) => {
  const {
    page,
    setPage,
    minKcal,
    setMinKcal,
    maxKcal,
    setMaxKcal,
    minProt,
    setMinProt,
    maxProt,
    setMaxProt,
    minSugar,
    setMinSugar,
    maxSugar,
    setMaxSugar,
    includeIngredients,
    setIncludeIngredients,
    excludeIngredients,
    setExcludeIngredients,
  } = useRecipeListFilters();

  const resetPage = () => setPage(1);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col mb-5">
        <span className="text-xl mb-2">kcal:</span>
        <RangeSlider
          min={0}
          max={1000}
          step={40}
          value={[minKcal ?? 0, maxKcal ?? 1000]}
          onValueCommit={([min, max]) => {
            resetPage();
            setMinKcal(min === 0 ? null : min);
            setMaxKcal(max === 1000 ? null : max);
          }}
        />

        <span className="text-xl mb-2">protein:</span>
        <RangeSlider
          min={0}
          max={60}
          step={5}
          value={[minProt ?? 0, maxProt ?? 60]}
          onValueCommit={([min, max]) => {
            resetPage();
            setMinProt(min === 0 ? null : min);
            setMaxProt(max === 60 ? null : max);
          }}
        />

        <span className="text-xl mb-2">sugar:</span>
        <RangeSlider
          min={0}
          max={80}
          step={5}
          value={[minSugar ?? 0, maxSugar ?? 80]}
          onValueCommit={([min, max]) => {
            resetPage();
            setMinSugar(min === 0 ? null : min);
            setMaxSugar(max === 80 ? null : max);
          }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <ChipsInput
          label="include ingredients:"
          value={includeIngredients ?? []}
          onChange={(arr) => {
            resetPage();
            setIncludeIngredients(arr.length ? arr : null);
          }}
          placeholder="type and press Enter…"
        />
        <ChipsInput
          label="exclude ingredients:"
          value={excludeIngredients ?? []}
          onChange={(arr) => {
            resetPage();
            setExcludeIngredients(arr.length ? arr : null);
          }}
          placeholder="for example, broccoli…"
        />
      </div>
    </div>
  );
};
