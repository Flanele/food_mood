import { useGetUserProfile } from "@/entities/user";
import { parseAsString, useQueryState } from "nuqs";
import React from "react";

type Tab = "form" | "recipes" | "logs" | "analytics";
const tabs: Tab[] = ["form", "recipes", "logs", "analytics"];

export const useProfilePage = () => {
  const { data, isLoading, isError } = useGetUserProfile();

  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("form"));
  const [selectedMealLogId, setSelectedMealLogId] = React.useState<
    number | null
  >(null);

  const safeTab = tabs.includes(tab as Tab) ? (tab as Tab) : "form";

  return {
    data,
    isLoading,
    isError,
    tab,
    setTab,
    safeTab,
    selectedMealLogId,
    setSelectedMealLogId,
  };
};

