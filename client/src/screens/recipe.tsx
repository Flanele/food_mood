"use client";

import { useRecipePage } from "@/features/recipes/recipe";
import {
  Button,
  Container,
  ErrorAnimation,
  SimpleLoader,
  Title,
} from "@/shared/ui";
import { Header } from "@/widgets";
import React from "react";
import { NotFoundPage } from "./not-found";
import {
  AnalyticsSection,
  RecipeInfoCard,
  RecipeStepsSection,
} from "@/entities/recipe";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared";
import { useSessionKey } from "@/entities/session";

interface Props {
  id: number;
}

export const RecipePage: React.FC<Props> = ({ id }) => {
  const { recipe, isLoading, isError, isNotFound } = useRecipePage(id);
  const router = useRouter();

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
          <div className="relative w-[80%] max-h-[620px] overflow-hidden group cursor-pointer">
            <img
              src={recipe.picture_url}
              alt={recipe.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
            />

            {/* Оверлей с кнопкой */}
            <div
              className="absolute inset-0 flex items-center justify-center 
               opacity-0 group-hover:opacity-100 transition-opacity duration-300 
               pointer-events-none"
            >
              <button
                className="
                cursor-pointer
                pointer-events-auto
                w-[40%]
                px-8 py-3 
                border border-white/60 
                text-white font-quantico text-xl
                rounded-md
                transition-all duration-300
                hover:border-primary hover:text-primary hover:bg-white/85
                active:scale-95
              "
              >
                Eat it!
              </button>
            </div>
          </div>

          <Title text={recipe.title} size="lg" />

          <RecipeInfoCard recipe={recipe} className="w-[80%]" />

          <AnalyticsSection recipe={recipe} className="w-[80%]" />

          <RecipeStepsSection recipe={recipe} className="w-[80%]" />

          <Button size="lg" className="w-[80%]">
            Make log with this recipe
          </Button>

          <Button
            onClick={() => router.push(ROUTES.EDIT_RECIPE + `/${recipe.id}`)}
            variant="secondary"
            size="lg"
            className="w-[80%]"
          >
            {" "}
            ✍️ Edit recipe
          </Button>
        </div>
      </Container>
    </>
  );
};
