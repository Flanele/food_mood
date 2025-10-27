import { cn } from "@/shared/lib/utils";
import { ErrorAnimation, Title } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  animatiomClassName?: string;
  text: string;
}

export const NotFoundError: React.FC<Props> = ({
  className,
  animatiomClassName,
  text,
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ErrorAnimation className={animatiomClassName} />
      <Title text={text} size="lg" className="font-quantico" />
    </div>
  );
};
