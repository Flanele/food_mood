import { RecommendationRecipeCard } from "@/entities/recommendations";
import { ROUTES } from "@/shared";
import { RecommendationItemDto } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { EmptyContentLoader } from "@/shared/ui";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
  peers?: RecommendationItemDto[];
}

export const PeersCatalog: React.FC<Props> = ({ className, peers }) => {
  const isEmpty = !peers || peers.length === 0;

  if (isEmpty) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-md border border-dashed border-border p-10 text-center",
          className
        )}
      >
        <div className="text-lg text-lg font-medium">
          No similar peers found yet
        </div>

        <div className="mt-2 max-w-md text-muted-foreground">
          We couldn’t find users with similar profile settings to show what they
          liked. Try{" "}
          <Link
            href={ROUTES.PROFILE}
            className="font-medium text-primary underline underline-offset-4 hover:opacity-90"
          >
            completing your profile
          </Link>{" "}
          to improve matching and unlock peer-based recommendations.
        </div>

        <EmptyContentLoader className="h-[300px] w-[300px]" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap justify-center gap-6", className)}>
      {peers.map((r) => (
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
