"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";

export function useImageField(prefix = "") {
  const { watch, setValue, resetField, clearErrors } = useFormContext();

  const names = React.useMemo(() => {
    const method = `${prefix}imageMethod` as const;
    const url = `${prefix}imageUrl` as const;
    const file = `${prefix}imageFile` as const;
    return { method, url, file };
  }, [prefix]);

  const method = watch(names.method);

  const switchToUrl = React.useCallback(() => {
    resetField(names.file, { keepDirty: false, keepTouched: false });
    setValue(names.file, undefined, { shouldValidate: true });
    clearErrors(names.file);

    setValue(names.method, "url", { shouldValidate: true });
  }, [names, resetField, setValue, clearErrors]);

  const switchToFile = React.useCallback(() => {
    resetField(names.url, { keepDirty: false, keepTouched: false });
    setValue(names.url, "", { shouldValidate: true });
    clearErrors(names.url);

    setValue(names.method, "file", { shouldValidate: true });
  }, [names, resetField, setValue, clearErrors]);

  const clearAll = React.useCallback(() => {
    setValue(names.method, undefined, { shouldValidate: true });
    setValue(names.url, undefined, { shouldValidate: true });
    setValue(names.file, undefined, { shouldValidate: true });
    clearErrors([names.method, names.url, names.file]);
  }, [names, setValue, clearErrors]);

  return { names, method, switchToUrl, switchToFile, clearAll };
}
