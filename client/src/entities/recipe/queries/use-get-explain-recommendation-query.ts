import { Objective } from "@/shared";
import { ExplainRecommendationDto } from "@/shared/api/gen";
import { recommendationsApi } from "@/shared/api/gen/gen-clients/recommendations";
import { useQuery } from "@tanstack/react-query";

const explainKey = ["explain"];

export const useGetExplainRecommandation = (
  id: number,
  objective?: Objective
) => {
  return useQuery<ExplainRecommendationDto>({
    queryKey: [...explainKey, id, objective],
    queryFn: () =>
      recommendationsApi.recommendationControllerExplain(id, {
        objective,
      }),
    enabled: !!id && !!objective,
  });
};
