"use client";

import { useGetRecipeQuery } from "@/entities/recipe";
import { AxiosError } from "axios";

export const useRecipePage = (id: number) => {
  const { data, isLoading, isError, error } = useGetRecipeQuery(id);

  const axiosError = error as AxiosError | null;

  const isNotFound = axiosError?.response?.status === 400;

  return {
    recipe: data,
    isLoading,
    isError,
    isNotFound,
  };
};
