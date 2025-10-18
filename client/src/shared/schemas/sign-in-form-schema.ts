import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "Please enter a valid password" });

export const formSignInSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: passwordSchema,
});
