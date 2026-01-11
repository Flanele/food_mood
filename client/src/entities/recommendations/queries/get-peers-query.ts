import {
  GetRecommendationsDto,
  RecommendationControllerGetPeersParams,
} from "@/shared/api/gen";
import { recommendationsApi } from "@/shared/api/gen/gen-clients/recommendations";
import { useQuery } from "@tanstack/react-query";

const peersKey = ["peers"];

export const useGetPeersQuery = (
  params: RecommendationControllerGetPeersParams
) => {
  return useQuery<GetRecommendationsDto>({
    queryKey: [...peersKey, params],
    queryFn: () => recommendationsApi.recommendationControllerGetPeers(params),
    refetchOnWindowFocus: false,
  });
};
