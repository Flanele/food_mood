import z from "zod";

export const optionalScoreSchema = z
  .union([
    z.literal("").transform(() => null),
    z.coerce.number().int().min(1).max(10),
    z.null(),
  ])
  .optional();
