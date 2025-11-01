import { ROUTES } from "@/shared";
import { authApi } from "@/shared/api/gen/gen-clients/auth";
import { formSignInSchema } from "@/shared/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

type LoginVars = { email: string; password: string };

export const useSignInForm = () => {
  const router = useRouter();

  const form = useForm<LoginVars>({
    resolver: zodResolver(formSignInSchema),
  });

  const signIn = ({ email, password }: LoginVars) =>
    authApi.authControllerSignIn({
      provider: "credentials",
      email,
      password,
    });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess() {
      router.push(ROUTES.HOME);
    },
  });

  return {
    form,
    serverError: signInMutation.error,
    handleSubmit: form.handleSubmit((data) => signInMutation.mutate(data)),
    isLoading: signInMutation.isPending,
  };
};
