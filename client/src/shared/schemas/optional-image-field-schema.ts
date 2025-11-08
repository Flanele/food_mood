import z from "zod";

export const OptionalImageFieldSchema = z
  .object({
    imageMethod: z.enum(["url", "file"]).optional(),
    imageUrl: z.string().trim().optional(),
    imageFile: z.instanceof(File).optional(),
  })
  .superRefine((d, ctx) => {
    const provided =
      !!d.imageMethod || !!d.imageUrl || d.imageFile instanceof File;

    if (!provided) return;

    if (!d.imageMethod) {
      ctx.addIssue({
        path: ["imageMethod"],
        code: "custom",
        message: "Choose URL or File",
      });
      return;
    }

    if (d.imageMethod === "url") {
      const ok = !!d.imageUrl && z.string().url().safeParse(d.imageUrl).success;
      if (!ok) {
        ctx.addIssue({
          path: ["imageUrl"],
          code: "custom",
          message: "Valid image URL is required",
        });
      }
    } else {
      if (!(d.imageFile instanceof File)) {
        ctx.addIssue({
          path: ["imageFile"],
          code: "custom",
          message: "Image file is required",
        });
        return;
      }
      if (!d.imageFile.type.startsWith("image/")) {
        ctx.addIssue({
          path: ["imageFile"],
          code: "custom",
          message: "Only image files are allowed (jpg, png, etc.)",
        });
      }
    }
  });
