"use client";

import { FormAddRecipeOutput } from "@/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { recipesApi } from "@/shared/api/gen/gen-clients/recipes";
import { mapFormToAddRecipeDto } from "../lib/mapFormToAddRecipeDto";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared";

const addRecipeKey = ["add-recipe"];

export const useAddRecipeMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: addRecipeKey,
    mutationFn: async (form: FormAddRecipeOutput) => {
      const dto = mapFormToAddRecipeDto(form);

      console.log("dto from mutation:", dto);
      await recipesApi.recipeControllerAddRecipe(dto);
    },
    onSuccess: () => {
      router.push(ROUTES.HOME);
    },
  });
};
