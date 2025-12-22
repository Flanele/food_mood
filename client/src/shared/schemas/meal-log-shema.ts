import z from "zod";
import { optionalScoreSchema } from "./optional-score-schema";

export const formMealLogSchema = z.object({
  servings: z.coerce
    .number()
    .int({ message: "Servings must be an integer" })
    .positive({ message: "Servings must be greater than 0" }),

  eatenDate: z.string().min(1, "Required"),
  eatenTime: z.string().min(1, "Required"),

  moodScore: optionalScoreSchema,

  energyScore: optionalScoreSchema,

  sleepScore: optionalScoreSchema,
});

export type MealLogFormInput = z.input<typeof formMealLogSchema>;
export type MealLogFormOutput = z.output<typeof formMealLogSchema>;
