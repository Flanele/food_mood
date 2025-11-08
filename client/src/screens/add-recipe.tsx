import { AddRecipeForm } from "@/features/forms";
import { Container } from "@/shared/ui";
import { Header } from "@/widgets";

export const AddRecipePage = () => {
  return (
    <>
      <Header mode="other" />
      <Container>
        <AddRecipeForm />
      </Container>
    </>
  );
};
