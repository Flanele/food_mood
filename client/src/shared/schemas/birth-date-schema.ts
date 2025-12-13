import z from "zod";

export const optionalDateSchema = z
  .union([
    z.literal("").transform(() => null),
    z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "Invalid date",
    }),
    z.null(),
  ])
  .optional();
