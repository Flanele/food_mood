import { authApi } from "@/shared/api/gen/gen-clients/auth";
import { useMutation } from "@tanstack/react-query";

export const useGoogleSignIn = () => {
  const googleSignInMutation = useMutation({
    mutationFn: (idToken: string) =>
      authApi.authControllerSignIn({ provider: "google", idToken }),
  });

  return {
    signIn: (idToken: string) => googleSignInMutation.mutate(idToken),
    isLoading: googleSignInMutation.isPending,
    serverError: googleSignInMutation.error,
  };
};
