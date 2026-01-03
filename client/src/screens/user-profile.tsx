"use client";

import { useProfileTabs } from "@/entities/tabs";
import { ProfileTabs } from "@/entities/tabs/ui/profile-tabs";
import { useGetUserProfile } from "@/entities/user";
import { ProfileAnalytics } from "@/features/analytics";
import { UserProfileForm } from "@/features/forms";
import { MealLogList } from "@/features/meal-logs/meal-log-list";
import { MyRecipeList } from "@/features/recipes/recipe-list";
import { Container } from "@/shared/ui";
import {
  Header,
  LoadingError,
  LoadingWithHeader,
  MealLogModal,
} from "@/widgets";
import React from "react";

export const UserProfilePage: React.FC = () => {
  const { data, isError, isLoading } = useGetUserProfile();
  const { tab, setTab } = useProfileTabs();

  const [selectedMealLogId, setSelectedMealLogId] = React.useState<
    number | null
  >(null);

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
          <ProfileTabs value={tab} onChange={setTab} />

          {/* content */}
          {tab === "form" && <UserProfileForm profile={data} />}

          {tab === "recipes" && <MyRecipeList />}

          {tab === "logs" && (
            <MealLogList onOpenLog={(id) => setSelectedMealLogId(id)} />
          )}

          {tab === "analytics" && <ProfileAnalytics />}
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
