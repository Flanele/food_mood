import { Container, ErrorAnimation } from "@/shared/ui";
import { Header } from "@/widgets";

export const NotFoundPage = () => {
  return (
    <>
      <Header mode={"other"} />
      <Container>
        <div className="flex flex-col items-center">
          <ErrorAnimation className="w-[600px] h-[600px]" />
          <p className="text-xl">
            Oops! This page appears to no longer exist or has been deleted...
          </p>
        </div>
      </Container>
    </>
  );
};
