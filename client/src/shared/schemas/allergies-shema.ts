import z from "zod";

export const allergiesSchema = z
  .union([
    z
      .array(z.string())
      .transform((arr) => arr.map((s) => s.trim()).filter(Boolean))
      .pipe(z.array(z.string().min(2, "Allegy must contain at least 2 characters")))
      .transform((arr) => (arr.length ? arr : null)),
    z.null(),
  ])
  .optional();

