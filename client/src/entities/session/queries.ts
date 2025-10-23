import { authApi } from "@/shared/api/gen/gen-clients/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const sessionKey = ["session"];

export const useSessionKey = () => {
  return useQuery({
    queryKey: sessionKey,
    queryFn: async () => {
      try {
        return await authApi.authControllerGetSessionInfo();
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 401) {
          await authApi.authControllerRefresh();
          return await authApi.authControllerGetSessionInfo();
        }
        throw err;
      }
    },
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};

export function useResetSession() {
  const queryClient = useQueryClient();
  return () => queryClient.removeQueries();
}
