import { useEditMealLogMutation } from "@/entities/meal-log";
import { MealLogDto } from "@/shared/api/gen";
import { splitIsoDateTime } from "@/shared/lib/utils";
import {
  formMealLogSchema,
  MealLogFormInput,
  MealLogFormOutput,
} from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useEditMealLogForm = (
  mealLog: MealLogDto,
  onSuccess: () => void
) => {
  const editMealLogMutation = useEditMealLogMutation(mealLog.id, onSuccess);

  const { date, time } = splitIsoDateTime(mealLog.eatenAt);

  const form = useForm<MealLogFormInput>({
    resolver: zodResolver(formMealLogSchema),
    mode: "onChange",
    defaultValues: {
      servings: mealLog.servings,
      eatenDate: date,
      eatenTime: time,
      moodScore: mealLog.moodScore,
      energyScore: mealLog.energyScore,
      sleepScore: mealLog.sleepScore,
    },
  });

  return {
    form,
    setValue: form.setValue,
    date,
    time,
    handleSubmit: form.handleSubmit((data) => {
      editMealLogMutation.mutate(data as MealLogFormOutput);
    }),
    isLoading: editMealLogMutation.isPending,
    isError: editMealLogMutation.isError,
  };
};
