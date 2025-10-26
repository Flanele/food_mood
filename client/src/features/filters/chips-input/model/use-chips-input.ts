import React from "react";

export const useChipsInput = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) => {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const name = raw.trim().toLowerCase();
    if (!name) return;
    if (value.includes(name)) return;
    onChange([...value, name]);
    setDraft("");
  };

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if ((e.key === "Enter" || e.key === "," || e.key === ";") && draft) {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value.length - 1);
    }
  };

  return {
    draft,
    setDraft,
    remove,
    onKeyDown,
  };
};
