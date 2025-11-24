import { useRecipeListQuery } from "@/entities/recipe-list/queries";
import { useDebouncedValue } from "@/features/debounce";
import { RecipeListQuery } from "@/shared";
import { useRecipeListFilters } from "./use-recipe-list-filters";

export const useRecipeList = () => {
  const filters = useRecipeListFilters();

  const query: RecipeListQuery = {
    q: filters.q,
    page: filters.page,
    limit: filters.limit,
    filters: {
      includeIngredients: filters.includeIngredients.length
        ? filters.includeIngredients
        : undefined,
      excludeIngredients: filters.excludeIngredients.length
        ? filters.excludeIngredients
        : undefined,
      minKcal: filters.minKcal ?? undefined,
      maxKcal: filters.maxKcal ?? undefined,
      minSugar: filters.minSugar ?? undefined,
      maxSugar: filters.maxSugar ?? undefined,
      minProt: filters.minProt ?? undefined,
      maxProt: filters.maxProt ?? undefined,
    },
  };

  const debouncedQuery = useDebouncedValue(query, 500);
  const { data, isLoading, error, isFetching } = useRecipeListQuery({
    query: debouncedQuery,
  });

  const currentPage = data?.meta.page ?? query.page ?? 1;
  const totalPages = data?.meta.pages ?? 1;

  const onPageChange = (page: number) => filters.setPage(page);

  return {
    data,
    currentPage,
    totalPages,
    onPageChange,
    query,
    isLoading,
    error,
    isFetching,
  };
};
