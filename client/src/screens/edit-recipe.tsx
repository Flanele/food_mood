"use client";

import { EditRecipeForm } from "@/features/forms";
import { useCanEditRecipe } from "@/features/recipes/recipe";
import {
  ForbiddenError,
  LoadingError,
  LoadingWithHeader,
  PageShell,
} from "@/widgets";
import React from "react";
import { NotFoundPage } from "./not-found";

interface Props {
  id: number;
}

export const EditRecipePage: React.FC<Props> = ({ id }) => {
  const { isLoading, isError, isNotFound, canEdit } = useCanEditRecipe(id);

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (isError) {
    return <LoadingError isProtected />;
  }

  if (isLoading) {
    return <LoadingWithHeader />;
  }

  if (!canEdit) {
    return <ForbiddenError />;
  }

  return (
    <PageShell mode="other">
      <EditRecipeForm id={id} />
    </PageShell>
  );
};
