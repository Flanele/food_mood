import { useAddRecipeMutation } from "@/entities/recipe";
import {
  FormAddRecipeInput,
  FormAddRecipeOutput,
  formAddRecipeSchema,
} from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

export const useAddRecipeForm = () => {
  const form = useForm<FormAddRecipeInput>({
    resolver: zodResolver(formAddRecipeSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      servings: 1,
      ingredients: [
        { name: "", unit: "g", amount: undefined, pieceGrams: undefined },
      ],
      imageMethod: "url",
      imageUrl: "",
      imageFile: undefined,
      steps: [
        {
          text: "",
          image: {
            imageMethod: undefined,
            imageUrl: undefined,
            imageFile: undefined,
          },
        },
        {
          text: "",
          image: {
            imageMethod: undefined,
            imageUrl: undefined,
            imageFile: undefined,
          },
        },
      ],
    },
  });

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

  const addRecipeMutation = useAddRecipeMutation();

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
      addRecipeMutation.mutate(data as FormAddRecipeOutput)
    ),
    isLoading: addRecipeMutation.isPending,
    isError: addRecipeMutation.isError,
  };
};
