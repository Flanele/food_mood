import { Button, Container, Logo } from "@/shared/ui";
import { CircleUser, Star, ThumbsUp, Utensils } from "lucide-react";

import Link from "next/link";
import React from "react";

type Mode = "home" | "recommendations" | "peers";

interface Props {
  mode: Mode;
}

export const Header: React.FC<Props> = ({ mode }) => {
  return (
    <div className="border-b-6 border-primary">
      <Container>
        <div className="flex justify-between items-center p-1 pb-4">
          <Link href={"/"} className="flex flex-col items-center">
            <Logo width={65} height={65} />
            <span className="font-quantico text-lg">Food Mood</span>
          </Link>

          {mode !== "home" && (
            <div className="flex gap-3 hover:underline hover:text-primary transition-colors">
              <Utensils width={25} height={25} />
              <Link className="font-quantico text-m" href={"/"}>
                Home page
              </Link>{" "}
            </div>
          )}

          {mode !== "recommendations" && (
            <div className="flex gap-3 hover:underline hover:text-primary transition-colors">
              <Star width={25} height={25} />
              <Link className="font-quantico text-m" href={"#"}>
                Personal recommendations
              </Link>{" "}
            </div>
          )}

          {mode !== "peers" && (
            <div className="flex gap-3 hover:underline hover:text-primary transition-colors">
              <ThumbsUp width={25} height={25} />
              <Link className="font-quantico text-m" href={"#"}>
                You might like it
              </Link>{" "}
            </div>
          )}

          <Button
            variant={"outline"}
            className="font-quantico text-black text-m border-black hover:border-primary hover:text-primary transition-colors rounded-[15px]"
          >
            <CircleUser className="mr-2" />
            <Link href={"#"}>Profile</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
};
