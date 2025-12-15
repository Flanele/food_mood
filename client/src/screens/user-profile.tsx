"use client";

import { useGetUserProfile } from "@/entities/user";
import { UserProfileForm } from "@/features/forms";
import { Container } from "@/shared/ui";
import { Header, LoadingError, LoadingWithHeader } from "@/widgets";
import React from "react";

export const UserProfilePage: React.FC = () => {
  const { data, isLoading, isError } = useGetUserProfile();

  if (isError) {
    return <LoadingError />;
  }

  if (isLoading || !data) {
    return <LoadingWithHeader />;
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
