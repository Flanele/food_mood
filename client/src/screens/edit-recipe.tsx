"use client";

import { EditRecipeForm } from "@/features/forms";
import { useCanEditRecipe } from "@/features/recipes/recipe";
import { Container } from "@/shared/ui";
import { ForbiddenError, Header, LoadingError, LoadingWithHeader } from "@/widgets";
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
    return <ForbiddenError />
  }

  return (
    <>
      <Header mode="other" />
      <Container>
        <EditRecipeForm id={id} />
      </Container>
    </>
  );
};
