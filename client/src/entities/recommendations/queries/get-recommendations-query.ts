import {
  GetRecommendationsDto,
  RecommendationControllerGetForYouParams,
} from "@/shared/api/gen";
import { recommendationsApi } from "@/shared/api/gen/gen-clients/recommendations";
import { useQuery } from "@tanstack/react-query";

const recommendationsKey = ["recommendations"];

export const useGetRecommendationsQuery = (
  params: RecommendationControllerGetForYouParams
) => {
  return useQuery<GetRecommendationsDto>({
    queryKey: [...recommendationsKey, params],
    queryFn: () => recommendationsApi.recommendationControllerGetForYou(params),
    refetchOnWindowFocus: false,
  });
};
