import { ImageIcon, LinkIcon } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormInput } from "./input-form";
import { cn } from "@/shared/lib/utils";
import { FormFileInput } from "./form-file-input";

export const ImageField: React.FC = () => {
  const {  setValue, watch, resetField, clearErrors } = useFormContext();
  const method = watch("imageMethod");

  const switchToUrl = () => {
    resetField("imageFile", { keepDirty: false, keepTouched: false });
    setValue("imageFile", undefined, { shouldValidate: true });
    clearErrors("imageFile");

    setValue("imageMethod", "url", { shouldValidate: true });
  };

  const switchToFile = () => {
    resetField("imageUrl", { keepDirty: false, keepTouched: false });
    setValue("imageUrl", "", { shouldValidate: true });
    clearErrors("imageUrl");

    setValue("imageMethod", "file", { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* переключатель режима */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={switchToUrl}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
            method === "url"
              ? "border-primary text-primary"
              : "border-secondary text-foreground/70"
          )}
        >
          <LinkIcon className="h-4 w-4" />
          URL
        </button>

        <button
          type="button"
          onClick={switchToFile}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
            method === "file"
              ? "border-primary text-primary"
              : "border-secondary text-foreground/70"
          )}
        >
          <ImageIcon className="h-4 w-4" />
          File
        </button>
      </div>

      {/* режим: URL */}
      {method === "url" && (
        <div className="w-full max-w-[520px]">
          <FormInput
            name="imageUrl"
            label="Image URL:"
            placeholder="https://example.com/image.jpg"
            required
            className="w-full"
          />
        </div>
      )}

      {/* режим: FILE (drag & drop + fallback input) */}
      {method === "file" && (
         <FormFileInput
         name="imageFile"
         required
         label="Image file:"
         className="w-full max-w-[520px]"
       />
      )}
    </div>
  );
};
