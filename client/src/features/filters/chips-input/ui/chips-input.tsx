"use client";

import React from "react";
import { useChipsInput } from "../model/use-chips-input";
import { Input } from "@/shared/ui";

interface Props {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export const ChipsInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  const { draft, setDraft, remove, onKeyDown } = useChipsInput({
    value,
    onChange,
  });

  return (
    <div className="flex flex-col">
      <span className="text-xl mb-2">{label}</span>

      <div className="flex flex-col gap-2">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {value.map((chip, i) => (
              <span
                key={`${chip}-${i}`}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-primary/20"
              >
                {chip}
                <button
                  className="cursor-pointer text-base leading-none"
                  onClick={() => remove(i)}
                  aria-label={`Remove ${chip}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="rounded-[22px] bg-primary/10 border-primary/20 placeholder:text-lg !text-lg"
        />
      </div>
    </div>
  );
};
