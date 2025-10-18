"use client";

import React from "react";
import { FormInput } from "@/features/forms/ui/input-form";
import { useSignInForm } from "../model/use-sign-in-form";
import { FormProvider } from "react-hook-form";
import { Button, ErrorText } from "@/shared/ui";
import { GoogleLoginConponent } from "../../google/ui/google-login-button";

export const LoginForm: React.FC = () => {
  const cred = useSignInForm();
  const isLoading = cred.isLoading;
  const serverError = cred.serverError;

  return (
    <FormProvider {...cred.form}>
      <form
        className="mx-auto w-full max-w-[700px] flex flex-col gap-6 p-4 border-1"
        onSubmit={cred.handleSubmit}
      >
        <FormInput name="email" label="Email" required />
        <FormInput name="password" label="Password" required />

        {serverError && <ErrorText className="mt-2" text={"SignIn failed"} />}

        <Button disabled={isLoading} className="rounded-lg p-6" type="submit">
          Sign In
        </Button>
        <GoogleLoginConponent />
      </form>
    </FormProvider>
  );
};
