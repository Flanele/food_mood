import { ingredientsApi } from "@/shared/api/gen/gen-clients/ingredients";
import { useQuery } from "@tanstack/react-query";

const ingredientWeightKey = ["ingredient-weight"];

export const useFindIngredientWeight = (
  ingredient: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: [...ingredientWeightKey, ingredient],
    enabled: enabled && !!ingredient,
    queryFn: async () => {
      const res = await ingredientsApi.ingredientControllerFindIngredientWeight(
        {
          name: ingredient!,
        }
      );

      if (res) {
        return res.gramsPerPiece;
      }

      return null;
    },
  });
};
