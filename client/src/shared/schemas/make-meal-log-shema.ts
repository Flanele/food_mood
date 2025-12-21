import z from "zod";
import { optionalScoreSchema } from "./optional-score-schema";

export const formMakeMealLogSchema = z.object({
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

export type MakeMealLogFormInput = z.input<typeof formMakeMealLogSchema>;
export type MakeMealLogFormOutput = z.output<typeof formMakeMealLogSchema>;
