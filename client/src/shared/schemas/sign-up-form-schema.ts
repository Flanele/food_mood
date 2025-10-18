import z from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "Password must contain at least 6 characters" });

export const formSignUpSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: passwordSchema,
});
