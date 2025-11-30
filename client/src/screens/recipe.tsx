"use client";

import { useRecipePage } from "@/features/recipes/recipe";
import { Container, ErrorAnimation, SimpleLoader, Title } from "@/shared/ui";
import { Header } from "@/widgets";
import React from "react";
import { NotFoundPage } from "./not-found";
import { RecipeInfoCard } from "@/entities/recipe";

interface Props {
  id: number;
}

export const RecipePage: React.FC<Props> = ({ id }) => {
  const { recipe, isLoading, isError, isNotFound } = useRecipePage(id);

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (isError) {
    return (
      <>
        <Header mode={"other"} />
        <Container>
          <div className="flex flex-col items-center">
            <ErrorAnimation className="w-[600px] h-[600px]" />
            <p className="text-xl">
              We encountered an error loading this page. Please try again
              later...
            </p>
          </div>
        </Container>
      </>
    );
  }

  if (isLoading || !recipe) {
    return (
      <>
        <Header mode="other" />
        <Container>
          <div className="flex flex-col items-center">
            <SimpleLoader className="w-[600px] h-[600px]" />
            <p className="text-xl">Loading...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header mode={"other"} />
      <Container>
        <div className="mt-10 p-2 gap-5 flex flex-col items-center w-full">
          
          <img
            src={recipe.picture_url}
           className="w-[70%] object-cover max-h-[620px]"
            alt={recipe.title}
          />

          <Title text={recipe.title} size="lg" />

          <RecipeInfoCard recipe={recipe} className="w-full" />
        </div>
      </Container>
    </>
  );
};
