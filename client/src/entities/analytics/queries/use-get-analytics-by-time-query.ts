import {
  AnalyticsControllerGetAnalyticsByTimeParams,
  GetAnalyticsByTimeDto,
} from "@/shared/api/gen";
import { analyticsApi } from "@/shared/api/gen/gen-clients/analytics";
import { useQuery } from "@tanstack/react-query";

const analyticsByTimeKey = ["analytics-by-time"];

export const useGetAnalyticsByTimeQuery = (
  params: AnalyticsControllerGetAnalyticsByTimeParams
) => {
  return useQuery<GetAnalyticsByTimeDto>({
    queryKey: [...analyticsByTimeKey, params],
    queryFn: () => analyticsApi.analyticsControllerGetAnalyticsByTime(params),
    refetchOnWindowFocus: false,
  });
};
