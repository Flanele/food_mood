import { recipesApi } from "@/shared/api/gen/gen-clients/recipes";
import { useQuery } from "@tanstack/react-query";

const myRecipeListKey = ["my-recipe-list"];

export const useMyRecipeListQuery = () => {
  return useQuery({
    queryKey: myRecipeListKey,
    queryFn: () => recipesApi.recipeControllerGetMyRecipes(),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};
