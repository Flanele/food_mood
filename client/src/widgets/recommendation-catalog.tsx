import { RecommendationRecipeCard } from "@/entities/recommendations";
import { RecommendationItemDto } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { EmptyContentLoader } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  recommendations?: RecommendationItemDto[];
}

export const RecommendationCatalog: React.FC<Props> = ({
  className,
  recommendations,
}) => {
  const isEmpty = !recommendations || recommendations.length === 0;

  if (isEmpty) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-md border border-dashed border-border p-10 text-center",
          className
        )}
      >
        <div className="text-base text-lg font-medium">
          Not enough data to generate recommendations
        </div>

        <div className="mt-2 max-w-md text-muted-foreground">
          We don’t have enough information in your profile yet. Try logging some
          meals to help us understand your habits and generate personalized
          recipe recommendations.
        </div>

        <EmptyContentLoader className="h-[300px] w-[300px]" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap justify-center gap-6", className)}>
      {recommendations.map((r) => (
        <div key={r.recipeId} className="w-full max-w-[520px]">
          <RecommendationRecipeCard
            title={r.title}
            pictureUrl={r.picture_url}
            score={r.score}
            ingredients={r.ingredients}
            id={r.recipeId}
          />
        </div>
      ))}
    </div>
  );
};
