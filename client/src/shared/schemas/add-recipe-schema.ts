import { z } from "zod";

export const formAddRecipeSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title cannot be empty or contain one letter" })
    .max(40, { message: "Your title is too long" }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Ingredient required" }),
        unit: z.string().min(1, { message: "Unit required" }),
        amount: z.string().min(1, { message: "Amount required" }),
      })
    )
    .min(1, { message: "At least one ingredient is required" }),
});
