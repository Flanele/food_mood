"use client";

import { useGetUserProfile } from "@/entities/user";
import { UserProfileForm } from "@/features/forms";
import { MealLogList } from "@/features/meal-log-list";
import { Button, Container } from "@/shared/ui";
import { Header, LoadingError, LoadingWithHeader } from "@/widgets";
import { parseAsString, useQueryState } from "nuqs";
import React from "react";

type Tab = "form" | "recipes" | "logs" | "analytics";
const tabs: Tab[] = ["form", "recipes", "logs", "analytics"];

export const UserProfilePage: React.FC = () => {
  const { data, isLoading, isError } = useGetUserProfile();

  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("form"));

  const safeTab = tabs.includes(tab as Tab) ? (tab as Tab) : "form";

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
        <div className="mt-10 flex flex-col gap-6">
          {/* tabs */}
          <div className="flex flex-wrap gap-5">
            <Button
              type="button"
              variant={safeTab === "form" ? "secondary" : "ghost"}
              onClick={() => setTab("profile")}
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

          {safeTab === "recipes" && <div>TODO: My recipes</div>}

          {safeTab === "logs" && <MealLogList />}

          {safeTab === "analytics" && <div>TODO: My analytics</div>}
        </div>
      </Container>
    </>
  );
};
