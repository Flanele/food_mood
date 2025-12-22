"use client";

import { AddMealLogDto } from "@/shared/api/gen";
import { mealLogsApi } from "@/shared/api/gen/gen-clients/mealLogs";
import { MealLogFormOutput } from "@/shared/schemas";
import { useMutation } from "@tanstack/react-query";

const makeMealLogKey = ["make-meal-log"];

export const useMakeMealLogMutation = (id: number, onSuccess: () => void) => {
  return useMutation({
    mutationKey: makeMealLogKey,
    mutationFn: async (form: MealLogFormOutput) => {
      const dto: AddMealLogDto = {
        recipeId: id,
        servings: form.servings,
        eatenAt: new Date(`${form.eatenDate}T${form.eatenTime}`).toISOString(),
        moodScore: form.moodScore ?? undefined,
        energyScore: form.energyScore ?? undefined,
        sleepScore: form.sleepScore ?? undefined,
      };

      await mealLogsApi.mealLogControllerAddMealLog(dto);
    },
    onSuccess: onSuccess,
  });
};
