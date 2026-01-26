"use client";

import { useRecipePage } from "@/features/recipes/recipe";
import { Button, Title } from "@/shared/ui";
import {
  LoadingError,
  LoadingWithHeader,
  MealLogModal,
  PageShell,
} from "@/widgets";
import React from "react";
import { NotFoundPage } from "./not-found";
import {
  AnalyticsSection,
  RecipeInfoCard,
  RecipeMainBanner,
  RecipeStepsSection,
} from "@/entities/recipe";
import { ROUTES } from "@/shared";
import { useMyProfileId } from "@/features/profile";
import Link from "next/link";

interface Props {
  id: number;
}

export const RecipePage: React.FC<Props> = ({ id }) => {
  const { recipe, isLoading, isError, isNotFound } = useRecipePage(id);
  const { myProfileId, isLoading: isProfileLoading } = useMyProfileId();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const authorProfileId = recipe?.authorProfileId as unknown as number;

  if (isNotFound) {
    return <NotFoundPage />;
  }

  if (isError) {
    return <LoadingError />;
  }

  if (isLoading || isProfileLoading || !recipe) {
    return <LoadingWithHeader />;
  }

  return (
    <PageShell mode="other">
      <div className="mt-10 p-2 gap-5 flex flex-col items-center w-full">
        <RecipeMainBanner
          className="w-[80%] max-h-[620px]"
          title={recipe.title}
          picture_url={recipe.picture_url}
          myProfileId={myProfileId}
          setIsModalOpen={setIsModalOpen}
        />

        <Title text={recipe.title} size="lg" />

        <RecipeInfoCard recipe={recipe} className="w-[80%]" />

        <AnalyticsSection recipe={recipe} className="w-[80%]" />

        <RecipeStepsSection recipe={recipe} className="w-[80%]" />

        {!myProfileId ? (
          <Button asChild size="lg" className="w-[80%]">
            <Link href={ROUTES.AUTH}>Make log with this recipe</Link>
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-[80%]"
            onClick={() => setIsModalOpen(true)}
          >
            Make log with this recipe
          </Button>
        )}

        {myProfileId === authorProfileId && (
          <Button asChild variant="secondary" size="lg" className="w-[80%]">
            <Link href={`${ROUTES.EDIT_RECIPE}/${recipe.id}`}>
              ✍️ Edit recipe
            </Link>
          </Button>
        )}
      </div>

      {isModalOpen && (
        <MealLogModal recipeId={id} onClose={() => setIsModalOpen(false)} />
      )}
    </PageShell>
  );
};
