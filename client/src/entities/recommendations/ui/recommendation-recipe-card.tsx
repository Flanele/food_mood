"use client";

import { ROUTES } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { Title } from "@/shared/ui";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  pictureUrl: string;
  score: number;
  ingredients: string[];
  className?: string;
  id: number;
}

export const RecommendationRecipeCard: React.FC<Props> = ({
  title,
  pictureUrl,
  score,
  ingredients,
  className,
  id,
}) => {
  const shownIngredients = ingredients.slice(0, 7);
  const restCount = Math.max(0, ingredients.length - shownIngredients.length);

  return (
    <Link href={`${ROUTES.RECIPE}/${id}`} className="block">
      <div
        className={cn(
          "relative flex h-[260px] w-full overflow-hidden rounded-md border border-secondary cursor-pointer transition-colors hover:border-primary",
          className
        )}
      >
        <div className="h-full w-[230px] shrink-0 overflow-hidden">
          <img
            className="h-full w-full object-cover"
            src={pictureUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <Title text={title} size="sm" className="line-clamp-2 break-words" />

          <div className="mt-1 flex flex-wrap gap-2">
            {shownIngredients.map((ing) => (
              <span
                key={ing}
                className="rounded-md bg-secondary px-2 py-1 text-foreground"
              >
                {ing}
              </span>
            ))}

            {restCount > 0 && (
              <span className="rounded-md bg-secondary px-2 py-1 text-muted-foreground">
                +{restCount} more
              </span>
            )}
          </div>
        </div>

        {/* score label (outside) */}
        <div className="pointer-events-none absolute bottom-2 right-[72px] text-sm text-muted-foreground">
          Score
        </div>

        {/* score corner (number inside) */}
        <div className="pointer-events-none absolute bottom-0 right-0">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 bg-[#00C950] clip-score-corner" />
            <div className="absolute bottom-2 right-2 text-sm font-semibold text-white">
              {Math.round(score * 100)}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-score-corner {
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </Link>
  );
};
