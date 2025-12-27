import { useMealLogListQuery } from "@/entities/meal-log-list";
import { cn } from "@/shared/lib/utils";
import { Button, ErrorAnimation, SimpleLoader } from "@/shared/ui";
import React from "react";

interface Props {
  className?: string;
  onOpenLog: (logId: number) => void;
}

export const MealLogList: React.FC<Props> = ({ className, onOpenLog }) => {
  const { data, isLoading, isError } = useMealLogListQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-10">
        <SimpleLoader className="w-[400px] h-[400px]" />
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-10 flex flex-col items-center gap-4">
        <ErrorAnimation className="w=[400px] h-[400px]" />
        <span>Oops. We encountered an error.</span>
      </div>
    );
  }

  if (!data?.meallogs?.length) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        You don’t have any meal logs yet.
      </div>
    );
  }

  return (
    <div className={cn(className, "flex flex-col gap-4")}>
      {data.meallogs.map((log) => (
        <div
          key={log.id}
          className="rounded-lg border border-secondary p-4 flex items-center justify-between"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm">
              Log for recipe{" "}
              <span className="font-medium">{log.recipeTitle}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(log.createdAt).toLocaleDateString()}
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={() => onOpenLog(log.id)}>
            View
          </Button>
        </div>
      ))}
    </div>
  );
};
