import { z } from "zod";
import { UNITS } from "../types/types";

export const IngredientSchema = z
  .object({
    name: z.string().min(2, { message: "Ingredient required" }),

    unit: z.enum(UNITS),

    amount: z.coerce
      .number()
      .positive({ message: "Amount must be greater than 0" }),

    gramsPerPiece: z.coerce.number().optional(),
  })
  .refine(
    (d) =>
      d.unit !== "piece" ||
      (!!d.gramsPerPiece &&
        !Number.isNaN(Number(d.gramsPerPiece)) &&
        Number(d.gramsPerPiece) > 0),
    {
      path: ["gramsPerPiece"],
      message: 'Grams per piece required when unit is "piece"',
    }
  );
