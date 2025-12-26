import { mealLogsApi } from "@/shared/api/gen/gen-clients/mealLogs";
import { useQuery } from "@tanstack/react-query";

const mealLogListKey = ["meal-log-list"];

export const useMealLogListQuery = () => {
  return useQuery({
    queryKey: mealLogListKey,
    queryFn: () => mealLogsApi.mealLogControllerGetAll(),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
