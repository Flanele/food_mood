import { z } from "zod";
import { IngredientSchema } from "./ingredient-schema";
import { ImageFieldSchema } from "./image-field-schema";

export const formAddRecipeSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title cannot be empty or contain one letter" })
      .max(40, { message: "Your title is too long" }),

    ingredients: z
      .array(IngredientSchema)
      .min(1, { message: "At least one ingredient is required" }),
  })
  .and(ImageFieldSchema);

  export type FormAddRecipeInput  = z.input<typeof formAddRecipeSchema>;   
  export type FormAddRecipeOutput = z.output<typeof formAddRecipeSchema>; 
