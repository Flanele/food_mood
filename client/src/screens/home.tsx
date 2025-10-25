import { Container, Input } from "@/shared/ui";
import { Header } from "@/widgets";

export const HomePage = () => {
  return (
    <>
      <Header mode="home" />
      <Container>
        <div className="flex mt-16 p-2">
          <span className="font-quantico text-[28px]">All recipes</span>
          <Input
            placeholder="Search recipe..."
            className="max-w-[50%] self-center rounded-[22px] mx-auto bg-primary/10 border-primary/20 placeholder:text-lg !text-lg"
          />
        </div>
      </Container>
    </>
  );
};
