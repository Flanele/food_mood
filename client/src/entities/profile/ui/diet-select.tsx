import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shared/ui";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
}

export const DietSelect: React.FC<Props> = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <div className="w-[240px]">
      {label && <p className="font-medium mb-2">{label}</p>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            onValueChange={(val) => field.onChange(val || undefined)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="select diet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">vegetarian</SelectItem>
              <SelectItem value="vegan">vegan</SelectItem>
              <SelectItem value="pescatarian">pescatarian</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
