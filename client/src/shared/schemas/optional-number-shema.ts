import z from "zod";

export const optionalNumberSchema = z
  .union([
    z.literal("").transform(() => null),
    z.coerce.number().min(1, "Must be > 0"),
    z.null(),
  ])
  .optional();

