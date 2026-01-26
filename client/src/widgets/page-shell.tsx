import React from "react";
import { Header } from "@/widgets";
import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui";

type HeaderMode = React.ComponentProps<typeof Header>["mode"];

interface Props {
  mode: HeaderMode;
  children: React.ReactNode;
  className?: string;
}

export const PageShell: React.FC<Props> = ({ mode, children, className }) => {
  return (
    <>
      <Header mode={mode} />
      <Container>
        <main className={cn(className, "pt-[120px]")}>{children}</main>
      </Container>
    </>
  );
};
