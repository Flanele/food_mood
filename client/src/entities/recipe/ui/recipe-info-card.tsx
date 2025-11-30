import { RecipeDto } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import React from "react";
import {
  Users,
  Flame,
  Wheat,
  Droplet,
  Drumstick,
  Candy,
  ListChecks,
} from "lucide-react";

interface Props {
  className?: string;
  recipe: RecipeDto;
}

export const RecipeInfoCard: React.FC<Props> = ({ className, recipe }) => {
  return (
    <div
      className={cn(
        className,
        "border border-primary bg-primary/10 py-4 px-6 flex flex-col gap-4"
      )}
    >
      {/* верхний блок с нутриентами */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-10 font-quantico text-base">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <span>servings: {recipe.servings}</span>
        </div>

        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <span>kcal: {recipe.kcalPerServ}</span>
        </div>

        <div className="flex items-center gap-2">
          <Wheat className="w-5 h-5 text-primary" />
          <span>carb: {recipe.carbPerServ}</span>
        </div>

        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-primary" />
          <span>fat: {recipe.fatPerServ}</span>
        </div>

        <div className="flex items-center gap-2">
          <Drumstick className="w-5 h-5 text-primary" />
          <span>prot: {recipe.protPerServ}</span>
        </div>

        <div className="flex items-center gap-2">
          <Candy className="w-5 h-5 text-primary" />
          <span>sugar: {recipe.sugarPerServ}</span>
        </div>
      </div>

      <div className="h-px bg-primary/30" />

      {/* ингредиенты */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-quantico">
          <ListChecks className="w-5 h-5 text-primary" />
          <span>Ingredients:</span>
        </div>

        <ul className="grid grid-cols-2 gap-x-8 gap-y-1 font-quantico text-sm">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id} className="list-disc ml-5">
              {ing.name} — {ing.amount} {ing.unit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
