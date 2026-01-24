import { z } from "zod";
import { UNITS } from "../types/types";

export const IngredientSchema = z
  .object({
    name: z.string().min(2, { message: "Ingredient required" }),

    externalId: z.number().int().positive().optional(),

    unit: z.enum(UNITS),

    amount: z.coerce
      .number()
      .positive({ message: "Amount must be greater than 0" }),

    pieceGrams: z.coerce.number().optional(),
  })
  .refine(
    (d) =>
      d.unit !== "piece" ||
      (!!d.pieceGrams &&
        !Number.isNaN(Number(d.pieceGrams)) &&
        Number(d.pieceGrams) > 0),
    {
      path: ["pieceGrams"],
      message: 'Grams per piece required when unit is "piece"',
    }
  );
