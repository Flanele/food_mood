import { StepDto } from "@/shared";
import { RecipeDto } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { Title } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  recipe: RecipeDto;
}

export const RecipeStepsSection: React.FC<Props> = ({ className, recipe }) => {
  const stepsPayload = recipe.steps as unknown as { steps: StepDto[] };

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      {stepsPayload.steps.map((step, index) => (
        <div key={index}>
          <Title className="font-bold" text={`Step ${step.order}:`} />
          <p className="text-xl">{step.text}</p>
          {step.imageUrl && (
            <img src={step.imageUrl} className="object-cover max-h-[700px]" />
          )}
        </div>
      ))}
    </div>
  );
};
