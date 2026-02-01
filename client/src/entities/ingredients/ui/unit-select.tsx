"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
}

export const UnitSelect: React.FC<Props> = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <div className="w-[120px]">
      {label && <p className="font-medium mb-2">{label}</p>}

      <Controller
        name={name}
        control={control}
        defaultValue="g"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="mg">mg</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="l">l</SelectItem>
              <SelectItem value="ounce">ounce</SelectItem>
              <SelectItem value="pounde">ponde</SelectItem>
              <SelectItem value="teaspoon">teaspoon</SelectItem>
              <SelectItem value="tablespoon">tablespoon</SelectItem>
              <SelectItem value="cup">cup</SelectItem>
              <SelectItem value="piece">piece</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
