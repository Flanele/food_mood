"use client";

import { useGetUserProfile } from "@/entities/user/queries/use-get-user-profile";
import { UserProfileForm } from "@/features/forms";
import { ROUTES } from "@/shared";
import { Container, ErrorAnimation, SimpleLoader } from "@/shared/ui";
import { Header } from "@/widgets";
import Link from "next/link";
import React from "react";

export const UserProfilePage: React.FC = () => {
  const { data, isError, isLoading } = useGetUserProfile();

  if (isError) {
    return (
      <>
        <Header mode={"other"} />
        <Container>
          <div className="flex flex-col items-center">
            <ErrorAnimation className="w-[600px] h-[600px]" />
            <p className="text-xl">
              We encountered an error loading this page. 
              If you're not logged in, please{" "}
              <Link
                href={ROUTES.AUTH}
                className="corsor-pointer underline text-primary"
              >
                log in
              </Link>{" "}
              first.
            </p>
          </div>
        </Container>
      </>
    );
  }

  if (isLoading || !data) {
    return (
      <>
        <Header mode="other" />
        <Container>
          <div className="flex flex-col items-center">
            <SimpleLoader className="w-[600px] h-[600px]" />
            <p className="text-xl">Loading...</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header mode="other" />
      <Container>
        <UserProfileForm profile={data} />
      </Container>
    </>
  );
};
