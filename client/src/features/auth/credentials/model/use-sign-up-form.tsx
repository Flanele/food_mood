import { ROUTES } from "@/shared";
import { authApi } from "@/shared/api/gen/gen-clients/auth";
import { FormSignUpSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginVars = { email: string; password: string };

export const useSignUpForm = () => {
  const router = useRouter();

  const form = useForm<LoginVars>({
    resolver: zodResolver(FormSignUpSchema),
  });

  const signUp = ({ email, password }: LoginVars) =>
    authApi.authControllerSignUp({
      provider: "credentials",
      email,
      password,
    });

  const signInMutation = useMutation({
    mutationFn: signUp,
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
