"use client";

import { useRecipePage } from "@/features/recipes/recipe";
import { Button, Container, Title } from "@/shared/ui";
import { Header, LoadingError, LoadingWithHeader, MealLogModal } from "@/widgets";
import React from "react";
import { NotFoundPage } from "./not-found";
import {
  AnalyticsSection,
  RecipeInfoCard,
  RecipeMainBanner,
  RecipeStepsSection,
} from "@/entities/recipe";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared";
import { useMyProfileId } from "@/features/profile";


interface Props {
  id: number;
}

export const RecipePage: React.FC<Props> = ({ id }) => {
  const { recipe, isLoading, isError, isNotFound } = useRecipePage(id);
  const { myProfileId, isLoading: isProfileLoading } = useMyProfileId();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const router = useRouter();

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
    <>
      <Header mode={"other"} />
      <Container>
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

          <Button
            onClick={() => {
              if (!myProfileId) {
                router.push(ROUTES.AUTH);
              } else {
                setIsModalOpen(true);
              }
            }}
            size="lg"
            className="w-[80%]"
          >
            Make log with this recipe
          </Button>

          {myProfileId === authorProfileId && (
            <Button
              onClick={() => router.push(ROUTES.EDIT_RECIPE + `/${recipe.id}`)}
              variant="secondary"
              size="lg"
              className="w-[80%]"
            >
              {" "}
              ✍️ Edit recipe
            </Button>
          )}
        </div>

        {isModalOpen && (
          <MealLogModal id={id} onClose={() => setIsModalOpen(false)} />
        )}
      </Container>
    </>
  );
};
