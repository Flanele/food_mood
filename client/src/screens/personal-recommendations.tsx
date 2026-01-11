"use client";

import { useGetRecommendationsQuery } from "@/entities/recommendations";
import {
  RecommendationObjectiveTabs,
  useRecommendationObjectiveTabs,
} from "@/entities/tabs";
import { Container } from "@/shared/ui";
import {
  Header,
  LoadingError,
  LoadingWithHeader,
  RecommendationCatalog,
} from "@/widgets";

import React from "react";

export const PersonalRecommendations: React.FC = () => {
  const { tab, setTab } = useRecommendationObjectiveTabs();

  const params = {
    objective: tab,
    limit: 20,
  };

  const { data, isLoading, isError } = useGetRecommendationsQuery(params);

  if (isError) {
    return <LoadingError />;
  }

  if (isLoading || !data) {
    return <LoadingWithHeader />;
  }

  return (
    <>
      <Header mode="recommendations" />
      <Container>
        <div className="flex flex-col items-center gap-2 mt-8 mb-10">
          <div className="text-lg font-medium font-quantico">
            Recommendation objective
          </div>
          <div className="max-w-xl text-center text-sm font-quantico text-muted-foreground">
            Choose what you want to focus on. We’ll tailor recipe
            recommendations based on your selected goal.
          </div>

          <RecommendationObjectiveTabs
            value={tab}
            onChange={setTab}
            className="py-5 justify-center"
          />

          <RecommendationCatalog recommendations={data?.items ?? []} />
        </div>
      </Container>
    </>
  );
};
