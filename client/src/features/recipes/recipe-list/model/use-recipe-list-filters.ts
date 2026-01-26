"use client";

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"; 

export const useRecipeListFilters = () => {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault(""));

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(18)
  );

  const [includeIngredients, setIncludeIngredients] = useQueryState(
    "includeIngredients",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [excludeIngredients, setExcludeIngredients] = useQueryState(
    "excludeIngredients",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [minKcal, setMinKcal] = useQueryState("minKcal", parseAsInteger);

  const [maxKcal, setMaxKcal] = useQueryState("maxKcal", parseAsInteger);

  const [minSugar, setMinSugar] = useQueryState("minSugar", parseAsInteger);

  const [maxSugar, setMaxSugar] = useQueryState("maxSugar", parseAsInteger);

  const [minProt, setMinProt] = useQueryState("minProt", parseAsInteger);

  const [maxProt, setMaxProt] = useQueryState("maxProt", parseAsInteger);

  return {
    q, setQ,
    page, setPage,
    limit, setLimit,
    includeIngredients, setIncludeIngredients,
    excludeIngredients, setExcludeIngredients,
    minKcal, setMinKcal,
    maxKcal, setMaxKcal,
    minSugar, setMinSugar,
    maxSugar, setMaxSugar,
    minProt, setMinProt,
    maxProt, setMaxProt,
  }
};
