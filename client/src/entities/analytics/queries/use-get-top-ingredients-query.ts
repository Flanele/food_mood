import {
  AnalyticsControllerGetTopIngredientsParams,
  GetTopIngredientsDto,
} from "@/shared/api/gen";
import { analyticsApi } from "@/shared/api/gen/gen-clients/analytics";
import { useQuery } from "@tanstack/react-query";

const topIngredientKey = ["top-ingredients"];

export const useGetTopIngredientsQuery = (
  params: AnalyticsControllerGetTopIngredientsParams
) => {
  return useQuery<GetTopIngredientsDto>({
    queryKey: [...topIngredientKey, params],
    queryFn: () => analyticsApi.analyticsControllerGetTopIngredients(params),
    refetchOnWindowFocus: false,
  });
};
