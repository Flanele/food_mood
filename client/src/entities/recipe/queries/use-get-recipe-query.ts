import { recipesApi } from "@/shared/api/gen/gen-clients/recipes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const recipeKey = ["recipe"];

export const useGetRecipeQuery = (id: number) => {
  const queryKey = [...recipeKey, id];

  return useQuery({
    queryKey: queryKey,
    queryFn: () => recipesApi.recipeControllerGetOne(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
