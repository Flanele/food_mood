"use client";

import { useGetMealLogQuery } from "@/entities/meal-log";
import { MealLogForm, useEditMealLogForm } from "@/features/forms";
import { MealLogDto } from "@/shared/api/gen";
import { ErrorAnimation, SimpleLoader } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  mealLogId: number;
  onSuccess: () => void;
}

export const EditMealLogForm: React.FC<Props> = ({
  className,
  mealLogId,
  onSuccess,
}) => {
  const { data: mealLog, isLoading, isError } = useGetMealLogQuery(mealLogId);

  if (isError) {
    return (
      <div className="px-6 py-10 flex flex-col items-center gap-4">
        <ErrorAnimation className="w=[300px] h-[300px]" />
        <span>Oops. We encountered an error.</span>
      </div>
    );
  }

  if (isLoading || !mealLog) {
    return (
      <div className="flex flex-col items-center pb-10">
        <SimpleLoader className="w-[300px] h-[300px]" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <EditMealLogFormInner
      className={className}
      mealLog={mealLog}
      onSuccess={onSuccess}
    />
  );
};

interface InnerProps {
  className?: string;
  mealLog: MealLogDto;
  onSuccess: () => void;
}

const EditMealLogFormInner: React.FC<InnerProps> = ({
  className,
  mealLog,
  onSuccess,
}) => {
  const formState = useEditMealLogForm(mealLog, onSuccess);

  const createdAt = new Date(mealLog.createdAt);
  const updatedAt = mealLog.updatedAt ? new Date(mealLog.updatedAt) : null;

  const showUpdated = updatedAt && updatedAt.getTime() !== createdAt.getTime();

  return (
    <div className={className}>
      <div className="px-6 pt-6 pb-2 flex flex-col gap-1">
        <p className="text-sm text-foreground">
          Log for <span className="font-bold">{mealLog.recipeTitle}</span> ·{" "}
          <span className="text-muted-foreground">
            {createdAt.toLocaleString()}
          </span>
        </p>

        {showUpdated && (
          <p className="text-xs text-muted-foreground">
            Last update: {updatedAt!.toLocaleString()}
          </p>
        )}
      </div>

      <MealLogForm {...formState} />
    </div>
  );
};
