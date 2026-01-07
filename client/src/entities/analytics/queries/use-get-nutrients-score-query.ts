import {
  AnalyticsControllerGetScoreCorrelationByMetricParams,
  GetNutrientsScoreDto,
} from "@/shared/api/gen";
import { analyticsApi } from "@/shared/api/gen/gen-clients/analytics";
import { useQuery } from "@tanstack/react-query";

const nutrientsScoreKey = ["nutrients-score"];

export const useGetNutrientsScoreQuery = (
  params: AnalyticsControllerGetScoreCorrelationByMetricParams
) => {
  return useQuery<GetNutrientsScoreDto>({
    queryKey: [...nutrientsScoreKey, params],
    queryFn: () =>
      analyticsApi.analyticsControllerGetScoreCorrelationByMetric(params),
    refetchOnWindowFocus: false,
  });
};
