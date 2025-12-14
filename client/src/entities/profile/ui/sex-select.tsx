import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/shared/ui";

interface SexSelectProps {
  name: string;
  label?: string;
}

export const SexSelect: React.FC<SexSelectProps> = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <div className="w-[200px]">
      {label && <p className="font-medium mb-2">{label}</p>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? "none"}
            onValueChange={(val) => field.onChange(val === "none" ? null : val)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specified</SelectItem>
              <SelectItem value="male">male</SelectItem>
              <SelectItem value="female">female</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
