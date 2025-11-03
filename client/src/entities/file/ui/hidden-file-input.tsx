"use client";
import * as React from "react";

type Props = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  name: string;
  accept?: string;
  onFile: (f: File) => void;
  fieldRef: (el: HTMLInputElement | null) => void;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "accept" | "onChange" | "onBlur"
>;

export const HiddenFileInput: React.FC<Props> = ({
  inputRef,
  name,
  accept = "image/*",
  onFile,
  fieldRef,
  onBlur,
  ...rest
}) => {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.currentTarget.files?.[0];
      if (f) onFile(f);
    },
    [onFile]
  );

  return (
    <input
      ref={(el) => {
        inputRef.current = el!;
        fieldRef(el);
      }}
      type="file"
      name={name}
      accept={accept}
      onChange={handleChange}
      onBlur={onBlur}
      className="hidden"
      {...rest}
    />
  );
};
