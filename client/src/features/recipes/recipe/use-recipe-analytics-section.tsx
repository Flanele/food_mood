"use client";

import { useGetExplainRecommandation } from "@/entities/recipe";
import { Objective } from "@/shared";
import React from "react";

export const useRecipeAnalyticsSection = (id: number) => {
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<Objective>("balanced");
  const { data, isLoading, isError } = useGetExplainRecommandation(
    id,
    activeTab
  );

  return {
    isInfoOpen,
    setIsInfoOpen,
    activeTab,
    setActiveTab,
    data,
    isLoading,
    isError,
  };
};
