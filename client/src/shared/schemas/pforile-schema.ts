import z from "zod";

export const formProfileSchema = z.object({
  sex: z.enum(["male", "female"]).nullable().optional(),

  birthDate: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => val === null || val === undefined || !isNaN(Date.parse(val)),
      "Invalid date format"
    ),

  heightCm: z.number().min(1, "Height must be > 0").nullable().optional(),

  weightKg: z.number().min(1, "Weight must be > 0").nullable().optional(),

  diet: z.enum(["vegetarian", "vegan", "pescatarian"]).nullable().optional(),

  allergies: z.array(z.string().min(2)).nullable().optional(),
});

export type ProfileFormInput = z.infer<typeof formProfileSchema>;
