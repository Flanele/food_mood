import { mealLogsApi } from "@/shared/api/gen/gen-clients/mealLogs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const mealLogKey = ["meal-log"];

export const useGetMealLogQuery = (id: number) => {
  const getMealLogKey = [...mealLogKey, id];

  return useQuery({
    queryKey: getMealLogKey,
    queryFn: () => mealLogsApi.mealLogControllerGetOne(id),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
