import { useSessionKey } from "@/entities/session";
import { useGetUserProfile } from "@/entities/user";

export const useMyProfileId = () => {
  const session = useSessionKey(); 
  const profile = useGetUserProfile(); 

  const isLoading = session.isLoading || profile.isLoading;
  const isError = session.isError || profile.isError;

  const myProfileId = profile.data?.id;

  return { myProfileId, isLoading, isError };
};
