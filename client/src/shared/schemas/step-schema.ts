import z from "zod";
import { OptionalImageFieldSchema } from "./optional-image-field-schema";

export const StepSchema = z.object({
  text: z.string().min(2, { message: "Step can not be empty" }),
  image: OptionalImageFieldSchema,
});
