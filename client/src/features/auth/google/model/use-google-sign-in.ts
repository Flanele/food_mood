import { ROUTES } from "@/shared";
import { authApi } from "@/shared/api/gen/gen-clients/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useGoogleSignIn = () => {
  const router = useRouter();

  const googleSignInMutation = useMutation({
    mutationFn: (idToken: string) =>
      authApi.authControllerSignIn({ provider: "google", idToken }),
    onSuccess() {
      router.push(ROUTES.HOME);
    },
  });

  return {
    handleSubmit: (idToken: string) => googleSignInMutation.mutate(idToken),
    isLoading: googleSignInMutation.isPending,
    serverError: googleSignInMutation.error,
  };
};
