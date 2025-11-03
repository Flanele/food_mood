import { RecipeCard } from "@/entities/recipe";
import { RecipeDto } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { SimpleLoader } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  recipes?: RecipeDto[];
  isLoading: boolean;
}

export const RecipeCatalog: React.FC<Props> = ({
  className,
  recipes,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex w-full min-h-[60vh] justify-center items-center">
        <SimpleLoader className="w-[280px] h-[280px]" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-8", className)}>
      {recipes?.map((r: RecipeDto) => (
        <RecipeCard
          key={r.id}
          title={r.title}
          pictureUrl={r.picture_url}
          kcalPerServ={r.kcalPerServ}
          protPerServ={r.protPerServ}
          fatPerServ={r.fatPerServ}
          carbPerServ={r.carbPerServ}
          sugarPerServ={r.sugarPerServ}
        />
      ))}
    </div>
  );
};
