"use client";

import { AddMealLogDto, PatchMealLogDto } from "@/shared/api/gen";
import { mealLogsApi } from "@/shared/api/gen/gen-clients/mealLogs";
import { MealLogFormOutput } from "@/shared/schemas";
import { useMutation } from "@tanstack/react-query";

const editMealLogKey = ["edit-meal-log"];

export const useEditMealLogMutation = (id: number, onSuccess: () => void) => {
  return useMutation({
    mutationKey: editMealLogKey,
    mutationFn: async (form: MealLogFormOutput) => {
      const dto: PatchMealLogDto = {
        servings: form.servings,
        eatenAt: new Date(`${form.eatenDate}T${form.eatenTime}`).toISOString(),
        moodScore: form.moodScore ?? null,
        energyScore: form.energyScore ?? null,
        sleepScore: form.sleepScore ?? null,
      };

      await mealLogsApi.mealLogControllerPatchMealLog(id, dto);
    },

    onSuccess: onSuccess,
  });
};
