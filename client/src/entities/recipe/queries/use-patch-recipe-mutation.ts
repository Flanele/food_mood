"use client";

import { FormAddRecipeOutput } from "@/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { mapFormToAddRecipeDto } from "../lib/mapFormToAddRecipeDto";
import { recipesApi } from "@/shared/api/gen/gen-clients/recipes";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared";

const patchRecipeKey = ["patch-recipe"];

export const usePatchRecipeMutation = ({ id }: { id: number }) => {
  const router = useRouter();

  return useMutation({
    mutationKey: patchRecipeKey,
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

      await recipesApi.recipeControllerPatchRecipe(id, dto, files);
    },
    onSuccess: () => {
      router.push(ROUTES.HOME);
    },
  });
};
