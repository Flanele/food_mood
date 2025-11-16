import { FormAddRecipeOutput } from "@/shared/schemas";
import { mapFormToAddRecipeDto } from "./mapFormToAddRecipeDto";

export const buildAddRecipeFormData = (form: FormAddRecipeOutput): FormData => {
  const dto = mapFormToAddRecipeDto(form);
  const fd = new FormData();

  fd.append("dto", JSON.stringify(dto));

  if (form.imageMethod === "file" && form.imageFile) {
    fd.append("picture_file", form.imageFile);
  }

  form.steps.forEach((step, index) => {
    if (step.image.imageMethod === "file" && step.image.imageFile) {
      fd.append(`steps[${index}].image_file`, step.image.imageFile);
    }
  });

  return fd;
};
