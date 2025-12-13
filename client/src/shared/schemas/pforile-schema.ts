import z from "zod";
import { allergiesSchema } from "./allergies-shema";
import { optionalNumberSchema } from "./optional-number-shema";
import { optionalDateSchema } from "./birth-date-schema";


export const formProfileSchema = z.object({
  sex: z.enum(["male", "female"]).nullable().optional(),

  birthDate: optionalDateSchema,

  heightCm: optionalNumberSchema,

  weightKg: optionalNumberSchema,

  diet: z.enum(["vegetarian", "vegan", "pescatarian"]).nullable().optional(),

  allergies: allergiesSchema.optional(),
});

export type ProfileFormInput = z.input<typeof formProfileSchema>;
export type ProfileFormOutput = z.output<typeof formProfileSchema>;