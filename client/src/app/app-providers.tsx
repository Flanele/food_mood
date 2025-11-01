"use client";

import { queryClient } from "@/shared/api/query-client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";

export function AppProviders({ children }: { children?: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <NextTopLoader
        color="#999999"
        height={3}
        crawlSpeed={200}
      />
    </GoogleOAuthProvider>
  );
}
