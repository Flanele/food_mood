"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  PathValue,
  Path,
  FieldValues,
} from "react-hook-form";
import { get } from "react-hook-form";
import { Upload } from "lucide-react";
import { ErrorText, RequiredSymbol } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { FileDropzone, FilePreview, HiddenFileInput } from "@/entities/file";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  required?: boolean;
  className?: string;
  dropzone?: boolean;
  showPreview?: boolean;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "onChange" | "onBlur"
>;

export function FormFileInput<T extends FieldValues>({
  name,
  label,
  required,
  className,
  dropzone = true,
  showPreview = true,
  ...props
}: Props<T>) {
  const { control, formState, setValue, trigger } = useFormContext<T>();
  const errorText = get(formState.errors, name)?.message as string | undefined;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const setFile = React.useCallback(
    (file?: File) => {
      setValue(name, file as PathValue<T, Path<T>>, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      void trigger(name);
    },
    [name, setValue, trigger]
  );

  const handlePickClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleDropFile = React.useCallback((f: File) => setFile(f), [setFile]);
  const handleClear = React.useCallback(() => setFile(undefined), [setFile]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const file = field.value as unknown as File | undefined;

        return (
          <div className={className}>
            {label && (
              <p className="font-medium mb-2">
                {label} {required && <RequiredSymbol />}
              </p>
            )}

            {dropzone ? (
              <FileDropzone onPick={handlePickClick} onFile={handleDropFile} />
            ) : (
              <button
                type="button"
                className="px-3 py-2 rounded border text-sm"
                onClick={handlePickClick}
              >
                Choose file
              </button>
            )}

            <HiddenFileInput
              inputRef={inputRef}
              name={field.name}
              onFile={setFile}
              fieldRef={field.ref}
              onBlur={field.onBlur}
              {...props}
            />

            {showPreview && <FilePreview file={file} onClear={handleClear} />}

            {(fieldState.error?.message || errorText) && (
              <ErrorText
                className="mt-2"
                text={(fieldState.error?.message || errorText) as string}
              />
            )}
          </div>
        );
      }}
    />
  );
}
