"use client";

import { useGetPeersQuery } from "@/entities/recommendations";
import {
  LoadingError,
  LoadingWithHeader,
  PageShell,
  PeersCatalog,
} from "@/widgets";

import React from "react";

export const Peers: React.FC = () => {
  const { data, isLoading, isError } = useGetPeersQuery({ limit: 20 });

  if (isError) {
    return <LoadingError />;
  }

  if (isLoading || !data) {
    return <LoadingWithHeader />;
  }

  return (
    <PageShell mode="peers">
      <div className="flex flex-col items-center gap-10 mt-8 mb-10">
        <div className="max-w-xl text-center text-sm font-quantico text-muted-foreground">
          This page shows recipe recommendations based on positive feedback from
          users with similar profile preferences.
        </div>

        <PeersCatalog peers={data?.items ?? []} />
      </div>
    </PageShell>
  );
};
