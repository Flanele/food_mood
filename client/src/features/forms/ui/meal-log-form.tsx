"use client";

import { cn, getNowDateTime } from "@/shared/lib/utils";
import React from "react";
import { FormInput } from "./input-form";
import { Button } from "@/shared/ui";
import { FormProvider } from "react-hook-form";
import { useMakeMealLogForm } from "../model/use-make-meal-log-form";

interface Props {
  className?: string;
  id: number;
  onSuccess: () => void,
}

export const MealLogForm: React.FC<Props> = ({ className, id, onSuccess }) => {
  const { form, setValue, date, time, isError, isLoading, handleSubmit } =
    useMakeMealLogForm(id, onSuccess);

  const clearBtnClass =
    "self-start mt-10 h-10 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary/40 hover:text-foreground cursor-pointer";

  return (
    <div className={cn("w-full p-8", className)}>
      <FormProvider {...form}>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Servings */}
          <FormInput
            name="servings"
            label="Servings:"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            className="w-[180px]"
          />

          {/* Eaten at */}
          <div className="flex items-center gap-2">
            <FormInput
              name="eatenDate"
              label="Date:"
              type="date"
              className="w-[180px]"
            />

            <FormInput
              name="eatenTime"
              label="Time:"
              type="time"
              step={60}
              className="w-[120px]"
            />

            <button
              type="button"
              className={clearBtnClass}
              aria-label="Clear eaten at"
              onClick={() => {
                setValue("eatenDate", date, { shouldValidate: true });
                setValue("eatenTime", time, { shouldValidate: true });
              }}
            >
              ✕
            </button>
          </div>

          {/* Scores */}
          <div className="flex flex-col gap-2">
            <span>Scores (optional):</span>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <FormInput
                  name="moodScore"
                  label="Mood:"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  step={1}
                  placeholder="1–10"
                  className="w-[160px]"
                />
                <button
                  type="button"
                  className={clearBtnClass}
                  aria-label="Clear mood"
                  onClick={() =>
                    setValue("moodScore", "", { shouldValidate: true })
                  }
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-2">
                <FormInput
                  name="energyScore"
                  label="Energy:"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  step={1}
                  placeholder="1–10"
                  className="w-[160px]"
                />
                <button
                  type="button"
                  className={clearBtnClass}
                  aria-label="Clear energy"
                  onClick={() =>
                    setValue("energyScore", "", { shouldValidate: true })
                  }
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-2">
                <FormInput
                  name="sleepScore"
                  label="Sleep:"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={10}
                  step={1}
                  placeholder="1–10"
                  className="w-[160px]"
                />
                <button
                  type="button"
                  className={clearBtnClass}
                  aria-label="Clear sleep"
                  onClick={() =>
                    setValue("sleepScore", "", { shouldValidate: true })
                  }
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              type="submit"
              className="bg-primary"
              disabled={isLoading}
            >
              Save meal log
            </Button>

            {isError && (
              <span>Something went wrong while submitting the meal log.</span>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
