import { IngredientControllerMakeIngredientSuggestionParams } from "@/shared/api/gen";
import { ingredientsApi } from "@/shared/api/gen/gen-clients/ingredients";
import { useQuery } from "@tanstack/react-query";

const suggestionKey = ["suggestion"];

export const useGetIngredientSuggestionQuery = (
  params: IngredientControllerMakeIngredientSuggestionParams | null
) => {
  return useQuery({
    queryKey: [...suggestionKey, params],
    queryFn: () =>
      ingredientsApi.ingredientControllerMakeIngredientSuggestion(params!),
    enabled: !!params,
  });
};
