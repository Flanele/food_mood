'use client'

import { queryClient } from "@/shared/api/query-client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export function AppProviders({ children }: { children?: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GoogleOAuthProvider>
   
  );
}
