"use client";

import { HomePage } from "@/screens";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
