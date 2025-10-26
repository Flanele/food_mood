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
    <div className={cn("flex border-1 border-secondary hover:border-primary cursor-pointer", className)}>
      <img
        className="w-[200px] h-full object-cover"
        src={pictureUrl}
        alt=""
      />

      <div className="flex flex-col p-3">
        <Title text={title} size="sm" />
        <span>kcal per serving: {kcalPerServ}</span>
        <span>prot per serving: {protPerServ}</span>
        <span>fat per serving: {fatPerServ}</span>
        <span>carb per serving: {carbPerServ}</span>
        <span>sugar per serving: {sugarPerServ}</span>
      </div>
    </div>
  );
};
