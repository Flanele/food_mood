"use client";

import { ROUTES } from "@/shared";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  className?: string;
  title: string;
  picture_url: string;
  myProfileId: number | undefined;
}

export const RecipeMainBanner: React.FC<Props> = ({
  className,
  title,
  picture_url,
  myProfileId,
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(className, "relative overflow-hidden group cursor-pointer")}
    >
      <img
        src={picture_url}
        alt={title}
        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
      />

      {/* Overlay with button */}
      <div
        className="
            absolute inset-0
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-none
          "
      >
        <button
          onClick={() => {
            if (!myProfileId) {
              router.push(ROUTES.AUTH);
            }
          }}
          className="
            cursor-pointer
              pointer-events-auto
              w-[40%]
              px-8 py-3
              border border-white/60
              rounded-md
              text-white font-quantico text-xl
              transition-all duration-300
              hover:border-primary hover:text-primary hover:bg-white/85
              active:scale-95
            "
        >
          Eat it!
        </button>
      </div>
    </div>
  );
};
