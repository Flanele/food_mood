import { AnalyticsControllerGetAnalyticsByTimeParams } from "@/shared/api/gen";
import { analyticsApi } from "@/shared/api/gen/gen-clients/analytics";
import { useQuery } from "@tanstack/react-query";

const analyticsByTimeKey = ["analytics-by-time"];

export const getAnalyticsByTimeQuery = (
  params: AnalyticsControllerGetAnalyticsByTimeParams
) => {
  return useQuery({
    queryKey: [...analyticsByTimeKey, params],
    queryFn: () => analyticsApi.analyticsControllerGetAnalyticsByTime(params),
    refetchOnWindowFocus: false,
  });
};
