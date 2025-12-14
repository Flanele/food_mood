import { LoginForm } from "@/features/auth";
import { Mode, ROUTES } from "@/shared";
import { Container, Logo } from "@/shared/ui";
import Link from "next/link";
import React from "react";

interface Props {
  mode: Mode;
}

export const AuthPage: React.FC<Props> = ({ mode }) => {
  return (
    <Container>
      <section className="h-screen border-5 border-primary px-4 py-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-5 items-center">
            <Logo width={130} height={130} />
            <h2 className="text-[40px] font-quantico">Welcome to FoodMood!</h2>
          </div>

          <p className="text-[24px] mb-15 font-quantico">
            {mode == "sign-in"
              ? "please log in to continue"
              : "complete a quik registration to continue"}
          </p>

          <LoginForm mode={mode} />

          {mode == "sign-in" && (
            <span className="p-8 test-lg font-quantico">
              Don't have an account?{" "}
              <Link
                href={ROUTES.SIGN_UP}
                className="text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors"
              >
                {" "}
                Register here!
              </Link>
            </span>
          )}

          {mode == "sign-up" && (
            <span className="p-8 test-lg font-quantico">
              Do you already have an account?{" "}
              <Link
                href={ROUTES.SIGN_IN}
                className="text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors"
              >
                {" "}
                Log here!
              </Link>
            </span>
          )}
        </div>
      </section>
    </Container>
  );
};
