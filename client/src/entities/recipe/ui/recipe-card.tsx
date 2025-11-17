import { cn } from "@/shared/lib/utils";
import { Title } from "@/shared/ui";
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
}) => {
  return (
    <div
      className={cn(
        "flex border-1 border-secondary hover:border-primary cursor-pointer",
        className
      )}
    >
      <img
        className="object-cover"
        src={pictureUrl}
        width={200}
        height={150}
        alt=""
        loading="lazy"
        decoding="async"
      />

      <div className="flex flex-col p-3">
        <Title text={title} size="sm" className="line-clamp-2 break-words" />
        <span>kcal per serving: {kcalPerServ}</span>
        <span>prot per serving: {protPerServ}</span>
        <span>fat per serving: {fatPerServ}</span>
        <span>carb per serving: {carbPerServ}</span>
        <span>sugar per serving: {sugarPerServ}</span>
      </div>
    </div>
  );
};
