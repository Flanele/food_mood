import React from "react";
import { Header } from "./header";
import { Container, SimpleLoader } from "@/shared/ui";

export const LoadingWithHeader: React.FC = () => {
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
};
