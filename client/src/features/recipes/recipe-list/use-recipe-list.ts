import { useRecipeListQuery } from "@/entities/recipe-list/queries";
import { useDebouncedValue } from "@/features/debounce";
import { RecipeListQuery } from "@/shared";
import React from "react";

export const useRecipeList = () => {
  const [query, setQuery] = React.useState<RecipeListQuery>({
    page: 1,
    limit: 20,
    filters: {},
  });

  const debouncedQuery = useDebouncedValue(query, 500);
  const { data, isLoading, error, isFetching } = useRecipeListQuery({
    query: debouncedQuery,
  });

  const currentPage = data?.meta.page ?? query.page ?? 1;
  const totalPages = data?.meta.pages ?? 1;

  const onPageChange = (page: number) =>
    setQuery((prev: RecipeListQuery) => ({ ...prev, page }));

  return {
    data,
    currentPage,
    totalPages,
    onPageChange,
    query,
    setQuery,
    isLoading,
    error,
    isFetching
  }
};
