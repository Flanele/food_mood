import { useGetRecipeQuery, usePatchRecipeMutation } from "@/entities/recipe";
import {
  FormAddRecipeInput,
  FormAddRecipeOutput,
  formAddRecipeSchema,
} from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

type StepsPayload = {
  steps?: { text: string; imageUrl: string }[];
};

export const useEditRecipeForm = (id: number) => {
  const { data } = useGetRecipeQuery(id);

  const form = useForm<FormAddRecipeInput>({
    resolver: zodResolver(formAddRecipeSchema),
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!data) return;

    const stepsPayload = data.steps as unknown as StepsPayload;

    form.reset({
      title: data.title,
      servings: data.servings,

      ingredients: data.ingredients.map((ing) => ({
        name: ing.name,
        unit: ing.unit,
        amount: ing.amount,
        pieceGrams: undefined,
      })) as FormAddRecipeInput["ingredients"],

      imageMethod: "url",
      imageUrl: data.picture_url,
      imageFile: undefined,

      steps: (stepsPayload.steps ?? []).map((step) => ({
        text: step.text,
        image: {
          imageMethod: step.imageUrl ? "url" : undefined,
          imageUrl: step.imageUrl ?? undefined,
          imageFile: undefined,
        },
      })),
    });
  }, [data, form]);

  const { control, watch } = form;
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: "steps" });

  const titleValue = watch("title");
  const titleLength = titleValue?.length || 0;

  const patchRecipeMutation = usePatchRecipeMutation({ id });

  return {
    form,
    titleLength,

    ingredientFields,
    appendIngredient,
    removeIngredient,

    stepFields,
    appendStep,
    removeStep,

    handleSubmit: form.handleSubmit((data) =>
      patchRecipeMutation.mutate(data as FormAddRecipeOutput)
    ),
    isLoading: patchRecipeMutation.isPending,
    isError: patchRecipeMutation.isError,
  };
};
