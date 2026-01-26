import { ROUTES } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { Title } from "@/shared/ui";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  pictureUrl: string;
  kcalPerServ: number;
  protPerServ: number;
  fatPerServ: number;
  carbPerServ: number;
  sugarPerServ: number;
  className?: string;
  id: number;
}

export const RecipeCard: React.FC<Props> = ({
  title,
  pictureUrl,
  kcalPerServ,
  protPerServ,
  fatPerServ,
  carbPerServ,
  sugarPerServ,
  className,
  id,
}) => {
  return (
    <Link href={`${ROUTES.RECIPE}/${id}`} className="block">
      <div
        className={cn(
          "flex flex-col h-[480px] overflow-hidden rounded-md border border-secondary hover:border-primary transition-colors cursor-pointer bg-white",
          className
        )}
      >
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={pictureUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex flex-col gap-1 p-3">
          <Title
            text={title}
            size="sm"
            className="line-clamp-2 break-words text-center"
          />

          <span className="text-sm text-muted-foreground text-center">
            kcal per serving: {kcalPerServ}
          </span>
          <span className="text-sm text-muted-foreground text-center">
            protein per serving: {protPerServ}
          </span>
          <span className="text-sm text-muted-foreground text-center">
            fat per serving: {fatPerServ}
          </span>
          <span className="text-sm text-muted-foreground text-center">
            carbs per serving: {carbPerServ}
          </span>
          <span className="text-sm text-muted-foreground text-center">
            sugar per serving: {sugarPerServ}
          </span>
        </div>
      </div>
    </Link>
  );
};
