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

      const files = {
        picture_file:
          form.imageMethod === "file" ? form.imageFile ?? undefined : undefined,
        stepFiles: form.steps.map((step) =>
          step.image.imageMethod === "file"
            ? step.image.imageFile ?? undefined
            : undefined
        ),
      };

      console.log("dto from mutation:", dto);
      await recipesApi.recipeControllerAddRecipe(dto, files);
    },
    onSuccess: () => {
      router.push(ROUTES.HOME);
    },
  });
};
