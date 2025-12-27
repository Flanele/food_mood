"use client";

import { MealLogForm, useMakeMealLogForm } from "@/features/forms";
import React from "react";

interface Props {
  className?: string;
  recipeId: number;
  onSuccess: () => void;
}

export const MakeMealLogForm: React.FC<Props> = ({
  className,
  recipeId,
  onSuccess,
}) => {
  const formState = useMakeMealLogForm(recipeId, onSuccess);

  return <MealLogForm {...formState} className={className} />;
};
