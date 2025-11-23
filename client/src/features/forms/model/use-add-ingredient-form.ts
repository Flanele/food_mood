import { useFindIngredientWeight } from "@/entities/ingredients";
import { useFormContext, useWatch } from "react-hook-form";

export const useAddIngredientForm = (index: number) => {
  const { control, setValue } = useFormContext();

  const unit = useWatch({
    control,
    name: `ingredients.${index}.unit`,
  });

  const name = useWatch({
    control,
    name: `ingredients.${index}.name`,
  });

  const { data: suggestedGrams, isFetching } = useFindIngredientWeight(
    unit === "piece" ? name : undefined,
    unit === "piece" && !!name
  );

  const handleUseSuggested = () => {
    if (suggestedGrams == null) return;

    setValue(`ingredients.${index}.pieceGrams`, suggestedGrams, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return {
    unit,
    suggestedGrams,
    isFetching,
    handleUseSuggested,
  };
};
