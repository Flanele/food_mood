"use client";

import { useGetIngredientSuggestionQuery } from "@/entities/ingredients";
import {
  IngredientControllerMakeIngredientSuggestionParams,
  IngredientSuggestionDto,
} from "@/shared/api/gen";
import { debounce } from "@/shared/lib/debounce";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

export const useIngredientSuggestions = (index: number) => {
  const { control, setValue } = useFormContext();

  const externalId = useWatch({
    control,
    name: `ingredients.${index}.externalId`,
  });

  const [params, setParams] =
    React.useState<IngredientControllerMakeIngredientSuggestionParams | null>(
      null
    );

  const { data, isLoading, isError, isSuccess } =
    useGetIngredientSuggestionQuery(params);

  const suggestions: IngredientSuggestionDto[] = data ?? [];

  const isIngredientNotValid = isSuccess && suggestions.length === 0;
  const hint = externalId
    ? {
        mode: "selected" as const,
        ingredient:
          suggestions.find((s) => s.externalId === externalId) ?? null,
      }
    : {
        mode: "likely" as const,
        ingredient: suggestions[0] ?? null,
      };

  const debouncedSetParams = React.useMemo(
    () =>
      debounce((q: string) => {
        setParams({ query: q, limit: 10 });
      }, 500),
    []
  );

  const requestSuggestions = (value: string) => {
    const q = value.trim().replace(/\s+/g, " ");

    if (q.length < 2) {
      setParams(null);
      return;
    }

    // если юзер печатает — выбранный externalId больше невалиден
    if (externalId) {
      setValue(`ingredients.${index}.externalId`, undefined, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }

    debouncedSetParams(q);
  };

  const selectSuggestion = (s: IngredientSuggestionDto) => {
    console.log("SELECTED SUGGESTION:", s);
    
    setValue(`ingredients.${index}.externalId`, s.externalId, {
      shouldDirty: true,
      shouldValidate: false,
    });
  };

  const searched = params !== null;

  return {
    suggestions,
    hint,
    requestSuggestions,
    selectSuggestion,
    isIngredientNotValid,
    isLoadingSuggestions: isLoading,
    suggestionsError: isError,
    searched,
  };
};
