"use client";

import { ProfileAnalytics } from "@/features/analytics";
import { UserProfileForm } from "@/features/forms";
import { MealLogList } from "@/features/meal-logs/meal-log-list";
import { useProfilePage } from "@/features/profile";
import { MyRecipeList } from "@/features/recipes/recipe-list";
import { Button, Container } from "@/shared/ui";
import {
  Header,
  LoadingError,
  LoadingWithHeader,
  MealLogModal,
} from "@/widgets";
import React from "react";

export const UserProfilePage: React.FC = () => {
  const {
    data,
    isError,
    isLoading,
    safeTab,
    setTab,
    selectedMealLogId,
    setSelectedMealLogId,
  } = useProfilePage();

  if (isError) {
    return <LoadingError />;
  }

  if (isLoading || !data) {
    return <LoadingWithHeader />;
  }

  return (
    <>
      <Header mode="other" />
      <Container>
        <div className="mt-10 mb-10 flex flex-col gap-6">
          {/* tabs */}
          <div className="flex flex-wrap gap-5">
            <Button
              type="button"
              variant={safeTab === "form" ? "secondary" : "ghost"}
              onClick={() => setTab("form")}
            >
              Profile
            </Button>

            <Button
              type="button"
              variant={safeTab === "recipes" ? "secondary" : "ghost"}
              onClick={() => setTab("recipes")}
            >
              My recipes
            </Button>

            <Button
              type="button"
              variant={safeTab === "logs" ? "secondary" : "ghost"}
              onClick={() => setTab("logs")}
            >
              My meal logs
            </Button>

            <Button
              type="button"
              variant={safeTab === "analytics" ? "secondary" : "ghost"}
              onClick={() => setTab("analytics")}
            >
              My analytics
            </Button>
          </div>

          {/* content */}
          {safeTab === "form" && <UserProfileForm profile={data} />}

          {safeTab === "recipes" && <MyRecipeList />}

          {safeTab === "logs" && (
            <MealLogList onOpenLog={(id: number) => setSelectedMealLogId(id)} />
          )}

          {safeTab === "analytics" && <ProfileAnalytics />}
        </div>

        {selectedMealLogId && (
          <MealLogModal
            mealLogId={selectedMealLogId}
            onClose={() => setSelectedMealLogId(null)}
          />
        )}
      </Container>
    </>
  );
};
 