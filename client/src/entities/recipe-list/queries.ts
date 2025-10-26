import { RecipeListQuery } from "@/shared";
import { recipesApi } from "@/shared/api/gen/gen-clients/recipes";
import { keepPreviousData, QueryKey, useQuery } from "@tanstack/react-query";
import React from "react";

const recipeListKey = ["recipe-list"];

export const useRecipeList = ({ query }: { query: RecipeListQuery }) => {
  const stableQuery = React.useMemo(() => query, [JSON.stringify(query)]);
  const queryKey = [...recipeListKey, stableQuery] as const satisfies QueryKey;

  return useQuery({
    queryKey,
    queryFn: () => recipesApi.recipeControllerGetAll(stableQuery),
    placeholderData: keepPreviousData,
  });
};
