import { AddRecipeDto } from "@/shared/api/gen";
import { FormAddRecipeOutput } from "@/shared/schemas";

export const mapFormToAddRecipeDto = (
  form: FormAddRecipeOutput
): AddRecipeDto => {
  const steps = form.steps.map((step, index) => {
    const base = {
      order: index + 1,
      text: step.text,
    };

    if (step.image.imageMethod === "url" && step.image.imageUrl) {
      return {
        ...base,
        imageUrl: step.image.imageUrl,
      };
    }

    return base;
  });

  const dto: AddRecipeDto = {
    title: form.title,
    servings: form.servings,
    ingredients: form.ingredients.map((i) => ({
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      ...(i.pieceGrams
        ? { opts: { pieceGrams: i.pieceGrams } }
        : {}),
    })),
    steps: {
      steps,
    },
    picture_url: form.imageUrl || "",
  };

  console.log("dto from mapper:", dto);

  return dto;
};
