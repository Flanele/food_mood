"use client";

import { useMakeMealLogMutation } from "@/entities/meal-log";
import { getNowDateTime } from "@/shared/lib/utils";
import {
  formMealLogSchema,
  MealLogFormInput,
  MealLogFormOutput,
} from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useMakeMealLogForm = (id: number, onSuccess: () => void) => {
  const makeMealLogMutation = useMakeMealLogMutation(id, onSuccess);

  const { date, time } = getNowDateTime();

  const form = useForm<MealLogFormInput>({
    resolver: zodResolver(formMealLogSchema),
    defaultValues: {
      servings: 1,
      eatenDate: date,
      eatenTime: time,
      moodScore: "",
      energyScore: "",
      sleepScore: "",
    },
  });

  return {
    form,
    setValue: form.setValue,
    date,
    time,
    handleSubmit: form.handleSubmit((data) => {
      makeMealLogMutation.mutate(data as MealLogFormOutput);
    }),
    isLoading: makeMealLogMutation.isPending,
    isError: makeMealLogMutation.isError,
  };
};
