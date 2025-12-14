"use client";

import { RecipeDto } from "@/shared/api/gen";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import React from "react";
import { Objective, ROUTES } from "@/shared";
import Link from "next/link";
import { useRecipeAnalyticsSection } from "@/features/recipes/recipe";

interface Props {
  className?: string;
  recipe: RecipeDto;
}

export const AnalyticsSection: React.FC<Props> = ({ className, recipe }) => {
  const {
    isInfoOpen,
    setIsInfoOpen,
    activeTab,
    setActiveTab,
    data,
    isLoading,
    isError,
  } = useRecipeAnalyticsSection(recipe.id);

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      <Button
        size="lg"
        variant={isInfoOpen ? "default" : "secondary"}
        onClick={() => setIsInfoOpen(!isInfoOpen)}
      >
        {isInfoOpen ? "Close analytics" : "🔥 Show additional information"}
      </Button>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300",
          isInfoOpen ? "max-h-[700px] opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        <div className="border border-primary bg-primary/5 px-4 py-3 text-sm">
          <div className="flex gap-2 border-b border-primary/40 pb-2 justify-center">
            {(
              [
                { key: "balanced", label: "balanced" },
                { key: "mood", label: "mood" },
                { key: "energy", label: "energy" },
                { key: "sleep", label: "sleep" },
              ] as { key: Objective; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-3 py-1 text-xs font-quantico uppercase tracking-wide border-b-2 transition-colors cursor-pointer",
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Контент активной вкладки */}
          <div className="mt-3 min-h-[120px]">
            {isLoading && (
              <p className="text-muted-foreground">
                Calculating analytics for this recipe...
              </p>
            )}

            {!isLoading && isError && (
              <p className="text-red-500">
                Failed to load analytics. Please try again later. <br />
                ⚠️ You must be{" "}
                <Link href={ROUTES.AUTH} className="cursor-pointer underline">
                  logged in
                </Link>{" "}
                to view this section.
              </p>
            )}

            {!isLoading && !isError && data && (
              <>
                {/* Общая часть: score + breakdown */}

                <p className="text-primary font-quantico mt-2 mb-3">
                  This section is generated based on your profile settings and
                  your logged meals.
                </p>

                <div className="space-y-1 mb-3">
                  <p className="mb-1">
                    <span className="font-quantico">Score:</span>{" "}
                    {data.score.toFixed(2)}
                  </p>

                  <p className="text-muted-foreground">
                    How much this recipe fits the selected objective (
                    <span className="font-quantico">{activeTab}</span>).
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-y-1 gap-x-8 text-xs mb-4">
                  <p>
                    <span className="font-quantico">Affinity:</span>{" "}
                    {(data.breakdown.affinity * 100).toFixed(0)}%
                  </p>
                  <p>
                    <span className="font-quantico">Preferences:</span>{" "}
                    {(data.breakdown.prefs * 100).toFixed(0)}%
                  </p>
                  <p>
                    <span className="font-quantico">Nutrients:</span>{" "}
                    {(data.breakdown.nutrientsObjective * 100).toFixed(0)}%
                  </p>
                  <p>
                    <span className="font-quantico">Profile similarity:</span>{" "}
                    {(data.breakdown.profileSimilarity * 100).toFixed(0)}%
                  </p>
                </div>

                {/* Разный текст для разных вкладок */}
                {activeTab === "balanced" && (
                  <div className="space-y-1">
                    <p className="font-quantico mb-1">Balanced:</p>
                    <p className="text-muted-foreground">
                      This score reflects how well the recipe fits a balanced
                      nutritional profile (proteins, fats, carbs, kcal).
                    </p>
                  </div>
                )}

                {activeTab === "mood" && (
                  <div className="space-y-1">
                    <p className="font-quantico mb-1">Mood:</p>
                    <p className="text-muted-foreground">
                      This score focuses on ingredients and nutrients that may
                      influence mood stability and emotional comfort.
                    </p>
                  </div>
                )}

                {activeTab === "energy" && (
                  <div className="space-y-1">
                    <p className="font-quantico mb-1">Energy:</p>
                    <p className="text-muted-foreground">
                      This score reflects how much sustainable energy this
                      recipe can provide (carbs, fats, overall density).
                    </p>
                  </div>
                )}

                {activeTab === "sleep" && (
                  <div className="space-y-1">
                    <p className="font-quantico mb-1">Sleep:</p>
                    <p className="text-muted-foreground">
                      This score indicates how friendly the recipe is for sleep:
                      not too heavy, not too sugary, and not overstimulating.
                    </p>
                  </div>
                )}

                {/* Причины (reasons) */}
                {data.reasons?.length > 0 && (
                  <div className="mt-3">
                    <p className="font-quantico mb-1">
                      Why this recipe got this score:
                    </p>
                    <ul className="list-disc ml-5 space-y-1">
                      {data.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
