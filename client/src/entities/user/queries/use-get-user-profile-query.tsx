import { userApi } from "@/shared/api/gen/gen-clients/user";
import { useQuery } from "@tanstack/react-query";

const profileKey = ["profile"];

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: profileKey,
    queryFn: () => userApi.userControllerGetMyProfile(),
  });
};
