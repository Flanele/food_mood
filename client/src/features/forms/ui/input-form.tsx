"use client";

import { ClearButton, ErrorText, Input, RequiredSymbol } from "@/shared/ui";
import React from "react";

import { get, useFormContext } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  type?: React.HTMLInputTypeAttribute;

  onValueChange?: (value: string) => void;
}

export const FormInput: React.FC<Props> = ({
  name,
  label,
  required,
  className,
  type,
  onValueChange,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = get(errors, name)?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
    onValueChange?.("");
  };

  const reg = register(name);

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input
          type={type}
          className="h-12 text-md"
          {...props}
          {...reg}
          onChange={(e) => {
            reg.onChange(e);
            onValueChange?.(e.target.value);
          }}
        />

        {value &&
          type !== "number" &&
          type !== "date" &&
          type !== "time" &&
          type !== "datetime-local" && <ClearButton onClick={onClickClear} />}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
