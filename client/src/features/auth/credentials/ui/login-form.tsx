"use client";

import React from "react";
import { FormInput } from "@/features/forms/ui/input-form";
import { useSignInForm } from "../model/use-sign-in-form";
import { FormProvider } from "react-hook-form";
import { Button, ErrorText } from "@/shared/ui";
import { GoogleLoginConponent } from "../../google/ui/google-login-button";
import { useSignUpForm } from "../model/use-sign-up-form";
import { Mode } from "@/shared";

interface Props {
  mode: Mode;
}

export const LoginForm: React.FC<Props> = ({ mode }) => {
  const signIn = useSignInForm();
  const signUp = useSignUpForm();

  const cred = mode === "sign-in" ? signIn : signUp;
  const isLoading = cred.isLoading;
  const serverError = cred.serverError;

  return (
    <FormProvider {...cred.form}>
      <form
        className="mx-auto w-full max-w-[70%] flex flex-col gap-6 p-10 border-2 border-border border-dashed"
        onSubmit={cred.handleSubmit}
      >
        <FormInput type="email" name="email" label="Email" required />
        <FormInput type="password" name="password" label="Password" required />

        {serverError && (
          <ErrorText
            className="mt-2"
            text={mode == "sign-in" ? "Sign In failed" : "Sign Up failed"}
          />
        )}

        <Button
          disabled={isLoading}
          className="rounded-lg p-6 text-lg"
          type="submit"
        >
          {mode == "sign-in" ? "Sign In" : "Sign Up"}
        </Button>
        <GoogleLoginConponent />
      </form>
    </FormProvider>
  );
};
