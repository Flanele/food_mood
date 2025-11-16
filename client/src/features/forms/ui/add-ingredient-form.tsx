import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "./input-form";
import { UnitSelect } from "@/entities/ingredients";
import { HelpTooltip } from "@/shared/ui";
import { X } from "lucide-react";
import { HELP_TEXTS } from "@/shared/constans/help-texts";

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
  const { control } = useFormContext();

  const unit = useWatch({
    control,
    name: `ingredients.${index}.unit`,
  });

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
        <FormInput
          name={`ingredients.${index}.pieceGrams`}
          label="Grams per piece:"
          required
          placeholder="50"
          className="w-[160px]"
        />
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
