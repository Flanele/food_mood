import React from "react";
import { FormInput } from "./input-form";
import { IngredientHint, UnitSelect } from "@/entities/ingredients";
import { HelpTooltip } from "@/shared/ui";
import { X } from "lucide-react";
import { HELP_TEXTS } from "@/shared/constans/help-texts";
import { useAddIngredientForm } from "../model/use-add-ingredient-form";
import { useIngredientSuggestions } from "../model/use-ingredient-suggestions";
import { IngredientSuggestionsDropDown } from "@/entities/dropdown";
import { IngredientSuggestionDto } from "@/shared/api/gen";

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

  const {
    requestSuggestions,
    suggestions,
    selectSuggestion,
    isLoadingSuggestions,
    suggestionsError,
    searched,
    hint,
    isIngredientNotValid,
  } = useIngredientSuggestions(index);

  const [openPopover, setOpenPopover] = React.useState<boolean>(false);

  const selectSuggestionHandler = (s: IngredientSuggestionDto) => {
    selectSuggestion(s);
    setOpenPopover(false);
  };

  const showHint = searched && !isLoadingSuggestions && !suggestionsError;

  return (
    <div className="flex flex-col gap-1">
      <div className="min-h-[16px] w-[300px]">
        <IngredientHint
          show={showHint}
          notFound={isIngredientNotValid}
          hint={hint}
        />
      </div>
  
      <div className="flex items-start gap-6 flex-wrap">
        <IngredientSuggestionsDropDown
          open={openPopover}
          onOpenChange={setOpenPopover}
          suggestions={suggestions}
          onSelect={selectSuggestionHandler}
          className="w-[300px]"
          isLoading={isLoadingSuggestions}
          isError={suggestionsError}
          searched={searched}
        >
          <FormInput
            name={`ingredients.${index}.name`}
            label="Ingredient:"
            required
            placeholder="Sugar"
            className="w-[300px]"
            onValueChange={requestSuggestions}
            onFocus={() => setOpenPopover(true)}
            autoComplete="off"
          />
        </IngredientSuggestionsDropDown>
  
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
    </div>
  );
  
};
