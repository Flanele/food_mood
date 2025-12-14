import React from "react";
import { FormInput } from "./input-form";
import { UnitSelect } from "@/entities/ingredients";
import { HelpTooltip } from "@/shared/ui";
import { X } from "lucide-react";
import { HELP_TEXTS } from "@/shared/constans/help-texts";
import { useAddIngredientForm } from "../model/use-add-ingredient-form";

interface Props {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  showTooltip?: boolean;
}

export const AddIngredientForm: React.FC<Props> = ({
  index,
  canRemove,
  onRemove, 
  showTooltip,
}) => {
  const { unit, suggestedGrams, isFetching, handleUseSuggested } =
    useAddIngredientForm(index);

  return (
    <div className="flex items-start gap-6">
      <FormInput
        name={`ingredients.${index}.name`}
        label="Ingredient:"
        required
        placeholder="Sugar"
        className="w-[300px]"
      />

      <UnitSelect name={`ingredients.${index}.unit`} label="Unit:" />

      <FormInput
        name={`ingredients.${index}.amount`}
        label="Amount:"
        required
        placeholder="100"
        className="w-[120px]"
      />

      {unit === "piece" && (
        <div className="flex flex-col gap-1">
          <FormInput
            name={`ingredients.${index}.pieceGrams`}
            label="Grams per piece:"
            required
            placeholder="50"
            className="w-[160px]"
          />

          {/* подсказка из кэша */}
          {isFetching && (
            <span className="text-xs text-gray-400">
              Checking cached weight...
            </span>
          )}

          {!isFetching && suggestedGrams != null && (
            <button
              type="button"
              onClick={handleUseSuggested}
              className="text-xs text-blue-600 hover:underline text-left cursor-pointer"
            >
              Use suggested: {suggestedGrams} g per piece
            </button>
          )}

          {!isFetching && suggestedGrams == null && (
            <span className="text-xs text-gray-400">
              No cached weight for this ingredient.
            </span>
          )}
        </div>
      )}

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-8 px-3 h-12 text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {showTooltip && (
        <div className="mt-10">
          <HelpTooltip text={HELP_TEXTS.ingredients} />
        </div>
      )}
    </div>
  );
};
