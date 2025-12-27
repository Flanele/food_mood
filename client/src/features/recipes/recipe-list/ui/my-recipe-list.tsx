"use client";

import { useMyRecipeListQuery } from "@/entities/recipe-list/queris/use-my-recipe-list-query";
import { ROUTES } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { Button, ErrorAnimation, SimpleLoader } from "@/shared/ui";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  className?: string;
}

export const MyRecipeList: React.FC<Props> = ({ className }) => {
  const { data, isError, isLoading } = useMyRecipeListQuery();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-10">
        <SimpleLoader className="w-[400px] h-[400px]" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-10 flex flex-col items-center gap-4">
        <ErrorAnimation className="w=[400px] h-[400px]" />
        <span>Oops. We encountered an error.</span>
      </div>
    );
  }

  if (!data?.recipes?.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        You don’t have any meal logs yet.
      </div>
    );
  }

  return (
    <div className={cn(className, "flex flex-col gap-4")}>
      {data.recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="rounded-md border border-secondary p-2 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-18 w-18 overflow-hidden rounded-md border border-secondary shrink-0">
              <img
                src={recipe.picture_url}
                alt={recipe.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex flex-col">
              <p className="text-sm font-medium truncate">{recipe.title}</p>
              <p className="text-xs text-muted-foreground">
                {recipe.kcalPerServ} kcal / serving
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => router.push(`${ROUTES.EDIT_RECIPE}/${recipe.id}`)}
          >
            Edit this recipe
          </Button>
        </div>
      ))}
    </div>
  );
};
