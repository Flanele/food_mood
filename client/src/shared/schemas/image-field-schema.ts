import { z } from "zod";

export const ImageFieldSchema = z
  .object({
    imageMethod: z.enum(["url", "file"]),
    imageUrl: z.string().trim().optional(),
    imageFile: z.instanceof(File).optional(),
  })

  .refine(
    (d) =>
      d.imageMethod !== "url" ||
      (!!d.imageUrl && z.url().safeParse(d.imageUrl).success),
    { path: ["imageUrl"], message: "Valid image URL is required" }
  )

  .refine((d) => d.imageMethod !== "file" || d.imageFile instanceof File, {
    path: ["imageFile"],
    message: "Image file is required",
  })

  .refine(
    (d) =>
      d.imageMethod !== "file" ||
      !d.imageFile ||
      d.imageFile.type.startsWith("image/"),
    {
      path: ["imageFile"],
      message: "Only image files are allowed (jpg, png, etc.)",
    }
  );
