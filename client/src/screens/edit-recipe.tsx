import { EditRecipeForm } from "@/features/forms";
import { Container } from "@/shared/ui";
import { Header } from "@/widgets";
import React from "react";

interface Props {
  id: number;
}

export const EditRecipePage: React.FC<Props> = ({ id }) => {
  return (
    <>
      <Header mode="other" />
      <Container>
        <EditRecipeForm id={id} />
      </Container>
    </>
  );
};
